#!/usr/bin/env sh
# Sirve el sitio por HTTP local para que el iframe de YouTube reciba un Referer válido.
cd "$(dirname "$0")"
python3 -m http.server 8000 --bind 127.0.0.1
