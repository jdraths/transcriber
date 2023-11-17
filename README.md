# whats in the box

1. takes an audioUrl
2. transcribes it via [replicate](https://replicate.com/)
3. transforms the replicate Json into a markdown file
4. all output files are in the gitignored `/output`

## setup

Make sure you have `REPLICATE_API_TOKEN` in `.env.local`

```sh
pnpm i
cp .env.sample .env.local
```

## usage

```sh
pnpm go --filename="guestZ" \
  --prompt="hostA and hostB interviewing guestZ" \
  --speakers=3 \
  --url="someAudioUrl"
```
