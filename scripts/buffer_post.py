#!/usr/bin/env python3
"""Reiht ein fertiges Carousel als Instagram-Post bei Buffer ein.

Hintergrund: Die Claude-Cloud-Routine, die die Slides erzeugt, kommt aus ihrer
Sandbox nicht an buffer.com heran (Egress-Proxy blockt die gesamte Domain mit
CONNECT 403). GitHub ist von dort aus dagegen erreichbar. Deshalb legt die
Routine nur noch eine post.json im Carousel-Ordner ab und pusht sie; dieses
Skript laeuft danach auf einem GitHub-Runner mit freiem Netz und erledigt den
Buffer-Teil.

Aufruf:
    python3 scripts/buffer_post.py [--dir output/carousel_YYYY-MM-DD] [--dry-run]

Ohne --dir wird der juengste Ordner output/carousel_* mit einer post.json und
ohne posted.json genommen. Das Buffer-Token kommt aus der Umgebungsvariable
BUFFER_TOKEN (im Repo als Actions-Secret hinterlegt).
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

BUFFER_API = "https://api.buffer.com"
REPO_RAW = "https://raw.githubusercontent.com/benalexanderb/benaro-digital-instagram-carousel/main"

# Der einzige Kanal, auf dem dieses Repo posten darf. Ein falscher Kanal hat in
# der Vergangenheit zu einem Fehlpost gefuehrt, deshalb wird hart geprueft.
EXPECTED_CHANNEL_ID = "6a65265be2638b94d7d55993"
EXPECTED_CHANNEL_NAME = "benarodigital"
EXPECTED_SERVICE = "instagram"
ORG_ID = "6a65235eb088b578e207cfd8"


class Fail(Exception):
    """Abbruch mit klarer Meldung."""


def gql(token: str, query: str, variables: dict, *, tries: int = 3) -> dict:
    payload = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    last_err = None
    for attempt in range(1, tries + 1):
        req = urllib.request.Request(
            BUFFER_API,
            data=payload,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                body = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", "replace")[:500]
            if exc.code in (401, 403):
                raise Fail(
                    f"Buffer lehnt das Token ab (HTTP {exc.code}). "
                    f"Secret BUFFER_TOKEN erneuern. Antwort: {detail}"
                ) from exc
            last_err = f"HTTP {exc.code}: {detail}"
        except (urllib.error.URLError, TimeoutError) as exc:
            last_err = f"Netzwerkfehler: {exc}"
        else:
            if body.get("errors"):
                raise Fail(f"Buffer-GraphQL-Fehler: {json.dumps(body['errors'])[:800]}")
            return body.get("data") or {}
        if attempt < tries:
            time.sleep(3 * attempt)
    raise Fail(f"Buffer-Anfrage nach {tries} Versuchen fehlgeschlagen. {last_err}")


def verify_channel(token: str, channel_id: str) -> None:
    """Kanal-Identitaet pruefen, bevor irgendetwas gepostet wird."""
    if channel_id != EXPECTED_CHANNEL_ID:
        raise Fail(
            f"post.json nennt Kanal {channel_id}, erlaubt ist nur "
            f"{EXPECTED_CHANNEL_ID} ({EXPECTED_CHANNEL_NAME})."
        )
    data = gql(
        token,
        "query GetChannel($input: ChannelInput!) { channel(input: $input) "
        "{ id name displayName service } }",
        {"input": {"id": channel_id}},
    )
    channel = data.get("channel")
    if not channel:
        raise Fail(f"Kanal {channel_id} nicht gefunden oder kein Zugriff.")
    names = {channel.get("name"), channel.get("displayName")}
    if EXPECTED_CHANNEL_NAME not in names or channel.get("service") != EXPECTED_SERVICE:
        raise Fail(
            f"Kanal-Identitaet passt nicht: name={channel.get('name')!r} "
            f"displayName={channel.get('displayName')!r} "
            f"service={channel.get('service')!r}. Es wird nicht gepostet."
        )
    print(f"Kanal verifiziert: {channel.get('name')} ({channel.get('service')})")


def already_queued(token: str, caption: str) -> dict | None:
    """Doppelposts verhindern: gleiche Caption schon eingereiht oder raus?"""
    data = gql(
        token,
        "query CheckPosts($input: PostsInput!) { posts(input: $input, first: 25) "
        "{ edges { node { id status text createdAt dueAt } } } }",
        {
            "input": {
                "organizationId": ORG_ID,
                "filter": {"channelIds": [EXPECTED_CHANNEL_ID]},
            }
        },
    )
    needle = " ".join(caption.split())[:80]
    for edge in (data.get("posts") or {}).get("edges") or []:
        node = edge.get("node") or {}
        text = " ".join((node.get("text") or "").split())
        if needle and needle in text:
            return node
    return None


def check_urls(urls: list[str]) -> None:
    """Buffer laedt die Bilder selbst, also muessen die URLs oeffentlich sein."""
    for url in urls:
        last = None
        for attempt in range(1, 6):
            try:
                req = urllib.request.Request(url, method="GET")
                with urllib.request.urlopen(req, timeout=30) as resp:
                    if resp.status == 200:
                        break
                    last = f"HTTP {resp.status}"
            except urllib.error.HTTPError as exc:
                last = f"HTTP {exc.code}"
            except (urllib.error.URLError, TimeoutError) as exc:
                last = str(exc)
            time.sleep(5 * attempt)
        else:
            raise Fail(f"Bild-URL nicht erreichbar ({last}): {url}")
    print(f"{len(urls)} Bild-URLs erreichbar (HTTP 200).")


def create_post(token: str, caption: str, assets: list[dict]) -> dict:
    mutation = (
        "mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { "
        "... on PostActionSuccess { post { id status dueAt } } "
        "... on InvalidInputError { message } "
        "... on UnauthorizedError { message } "
        "... on NotFoundError { message } "
        "... on LimitReachedError { message } "
        "... on RestProxyError { code message link } "
        "... on UnexpectedError { message } } }"
    )
    data = gql(
        token,
        mutation,
        {
            "input": {
                "channelId": EXPECTED_CHANNEL_ID,
                "text": caption,
                "assets": assets,
                "mode": "addToQueue",
                "schedulingType": "automatic",
                "metadata": {"instagram": {"type": "post", "shouldShareToFeed": True}},
            }
        },
    )
    result = data.get("createPost") or {}
    post = result.get("post")
    if not post:
        raise Fail(f"Buffer hat keinen Post angelegt: {json.dumps(result)[:800]}")
    return post


def pick_dir(repo_root: Path, explicit: str | None) -> Path | None:
    if explicit:
        target = (repo_root / explicit).resolve()
        if not target.is_dir():
            raise Fail(f"Ordner existiert nicht: {explicit}")
        return target
    candidates = sorted(
        p.parent
        for p in (repo_root / "output").glob("carousel_*/post.json")
        if not (p.parent / "posted.json").exists()
    )
    # Kein offener Ordner ist kein Fehler: das passiert, wenn eine post.json
    # nachgereicht wird, deren Post schon eingereiht ist. Der Aufrufer macht
    # daraus ein sauberes Ende statt eines Fehlalarms.
    return candidates[-1] if candidates else None


def load_post_json(folder: Path) -> dict:
    path = folder / "post.json"
    if not path.is_file():
        raise Fail(f"Keine post.json in {folder.name}.")
    try:
        spec = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise Fail(f"post.json ist kein gueltiges JSON: {exc}") from exc

    caption = (spec.get("caption") or "").strip()
    if not caption:
        raise Fail("post.json enthaelt keine caption.")
    slides = spec.get("slides") or []
    if not 2 <= len(slides) <= 10:
        raise Fail(
            f"post.json enthaelt {len(slides)} Slides. Instagram-Carousels "
            "brauchen 2 bis 10."
        )
    normalized = []
    for index, slide in enumerate(slides, start=1):
        if isinstance(slide, str):
            url, alt = slide, f"Slide {index}"
        else:
            url = (slide.get("url") or "").strip()
            alt = (slide.get("altText") or f"Slide {index}").strip()
        if not url:
            raise Fail(f"Slide {index} hat keine url.")
        if not url.startswith(f"{REPO_RAW}/"):
            raise Fail(f"Slide {index} zeigt nicht auf dieses Repo (main): {url}")
        normalized.append({"url": url, "altText": alt})
    spec["caption"] = caption
    spec["slides"] = normalized
    spec.setdefault("channelId", EXPECTED_CHANNEL_ID)
    return spec


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", dest="folder", default=None)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    token = os.environ.get("BUFFER_TOKEN", "").strip()
    if not token:
        raise Fail(
            "BUFFER_TOKEN fehlt. Im Repo unter Settings > Secrets and variables "
            "> Actions als BUFFER_TOKEN hinterlegen."
        )

    folder = pick_dir(repo_root, args.folder)
    if folder is None:
        print("Kein Carousel mit offener post.json, nichts zu tun.")
        return 0
    rel = folder.relative_to(repo_root)
    print(f"Carousel-Ordner: {rel}")

    if (folder / "posted.json").exists():
        print("posted.json vorhanden - wurde bereits eingereiht, nichts zu tun.")
        return 0

    spec = load_post_json(folder)
    verify_channel(token, spec["channelId"])
    check_urls([s["url"] for s in spec["slides"]])

    if args.dry_run:
        print("--dry-run: Kanal und Bilder geprueft, es wurde NICHT gepostet.")
        print(f"Caption ({len(spec['caption'])} Zeichen):\n{spec['caption']}")
        return 0

    duplicate = already_queued(token, spec["caption"])
    if duplicate:
        print(
            f"Post mit gleicher Caption existiert bereits "
            f"(id={duplicate.get('id')}, status={duplicate.get('status')}) - "
            "es wird kein Duplikat angelegt."
        )
        post = duplicate
    else:
        assets = [
            {"image": {"url": s["url"], "metadata": {"altText": s["altText"]}}}
            for s in spec["slides"]
        ]
        post = create_post(token, spec["caption"], assets)
        print(
            f"Post eingereiht: id={post.get('id')} status={post.get('status')} "
            f"dueAt={post.get('dueAt')}"
        )

    (folder / "posted.json").write_text(
        json.dumps(
            {
                "postId": post.get("id"),
                "status": post.get("status"),
                "dueAt": post.get("dueAt"),
                "slides": len(spec["slides"]),
                "postedBy": "github-actions/buffer-post",
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Marker geschrieben: {rel}/posted.json")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Fail as err:
        print(f"FEHLER: {err}", file=sys.stderr)
        sys.exit(1)
