# Paso a paso: deploy de backend + frontend a un VPS

Proceso probado con DevOpsLab, para repetir con Clerkiva. Seguir en orden.
**No guardar acá contraseñas, tokens ni claves privadas.**

Esquema:
- Rama `preprod` → environment `staging` → carpeta `/opt/clerkiva/staging` → puerto 8081
- Rama `prod` → environment `production` → carpeta `/opt/clerkiva/production` → puerto 8080

Cada comando dice dónde se corre:
- 💻 **Mac**: terminal de tu máquina
- 🖥️ **VPS**: dentro del servidor (`root@...:~#`)

---

## Paso 0: Herramientas y variables

💻 Permitir comentarios (`# ...`) en la terminal de la Mac, para poder pegar los comandos tal cual (una sola vez):

```bash
echo 'setopt interactivecomments' >> ~/.zshrc && source ~/.zshrc
```

💻 Instalar y loguear la CLI de GitHub (una sola vez):

```bash
brew install gh
gh auth login          # GitHub.com → HTTPS → Login with a web browser
```

💻 Definir variables para copiar y pegar los comandos de abajo. **Viven solo en esa terminal**: si abrís otra, hay que volver a definirlas.

```bash
GH_USER=fedeU3                       # tu usuario de GitHub
BACK=$GH_USER/<repo-backend>         # ej. fedeU3/ClerkivaBackend
FRONT=$GH_USER/<repo-frontend>       # ej. fedeU3/ClerkivaFrontend
KEY=~/.ssh/clerkiva_deploy
IP=<IP_DEL_VPS>                      # se completa en el paso 5
```

---

## Paso 1: SonarCloud (web)

1. sonarcloud.io → **+ → Analyze new project** → elegir los dos repos.
2. En cada proyecto: **Administration → Analysis Method → desactivar Automatic Analysis**.
3. Anotar:
   - **Organization Key**: avatar → My Organizations → Key (no el nombre visible).
   - **Project Key**: proyecto → Information → Project Key.
4. **My Account → Security → Generate Token** → copiarlo.

## Paso 2: Secretos de Sonar en GitHub

💻 Cada comando pide el valor (pegarlo y Enter). Así no queda en el historial de la terminal:

```bash
for R in $BACK $FRONT; do
  gh secret set SONAR_TOKEN -R $R
  gh secret set SONAR_ORG -R $R
  gh secret set SONAR_PROJECT_KEY -R $R
done
```

`SONAR_PROJECT_KEY` es distinto en cada repo: cuando lo pide, pegar el del repo que corresponde (primero backend, después frontend).

💻 Verificar:

```bash
gh secret list -R $BACK
gh secret list -R $FRONT
```

## Paso 3: Generar la clave SSH

💻

```bash
ssh-keygen -t ed25519 -f $KEY -C "clerkiva-deploy"
```

- Passphrase: **Enter dos veces** (vacía).
- Si pregunta `Overwrite?`, responder **n**.

💻 Verificar que estén las dos (privada y `.pub`):

```bash
ls -l $KEY $KEY.pub
head -1 $KEY        # -----BEGIN OPENSSH PRIVATE KEY-----
cat $KEY.pub        # ssh-ed25519 AAAA... clerkiva-deploy
```

## Paso 4: Cargar la clave pública en Vultr

💻 Copiarla al portapapeles:

```bash
pbcopy < $KEY.pub
```

Vultr → **Account → SSH Keys → Add SSH Key** → nombre `clerkiva-deploy` → Cmd+V → guardar.

## Paso 5: Crear el VPS (web)

1. **Compute → Deploy +**
2. **Shared CPU** → **hacer clic en la fila del plan** (ej. `vc2-1c-1gb`). Revisar en el Summary que aparezca ese plan. **No** elegir planes `-v6`.
3. **Location:** São Paulo.
4. **Configure →** (no saltear):
   - Operating System: **Ubuntu 24.04 LTS x64**
   - SSH Keys: **tildar `clerkiva-deploy`**
   - Automatic Backups: desactivado
   - Hostname / Label: `clerkiva`
5. **Deploy Now** → esperar "Running" → copiar la IP.

💻 Guardar la IP en la variable:

```bash
IP=<la IP>
```

Vultr cobra mientras la instancia exista, aunque esté apagada. Para dejar de pagar hay que **destruirla**.

## Paso 6: Entrar al VPS

💻

```bash
ssh -i $KEY root@$IP
```

- `Are you sure you want to continue connecting?` → **yes**
- Si pide contraseña, la clave no quedó instalada. Ctrl+C y:
  ```bash
  ssh-copy-id -i $KEY.pub root@$IP     # pide la contraseña de Vultr → Overview → Password
  ssh -i $KEY root@$IP                 # ahora sin contraseña
  ```

## Paso 7: Preparar el VPS

🖥️ De a un bloque:

```bash
apt update && apt upgrade -y
```

```bash
curl -fsSL https://get.docker.com | sh
docker --version && docker compose version
```

```bash
free -h            # "Swap" tiene que tener algo (Vultr trae 2 GB)
```

Solo si `Swap` dice `0B`:

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

```bash
mkdir -p /opt/clerkiva/staging /opt/clerkiva/production
ls /opt/clerkiva
```

```bash
ufw allow OpenSSH        # primero allow...
ufw --force enable       # ...después enable
ufw status
```

```bash
exit
```

## Paso 8: Environment `staging` y sus secretos

💻 Crear el environment en los dos repos:

```bash
for R in $BACK $FRONT; do
  gh api -X PUT repos/$R/environments/staging >/dev/null && echo "staging OK en $R"
done
```

💻 Secretos del VPS (los mismos en los dos repos):

```bash
for R in $BACK $FRONT; do
  gh secret set VPS_HOST        --env staging -R $R --body "$IP"
  gh secret set VPS_USER        --env staging -R $R --body "root"
  gh secret set VPS_SSH_KEY     --env staging -R $R < $KEY
  ssh-keyscan $IP 2>/dev/null | gh secret set VPS_KNOWN_HOSTS --env staging -R $R
done
```

💻 `.env` de la app (solo backend). Armar un archivo temporal, subirlo y borrarlo:

```bash
cat > /tmp/staging.env <<EOF
DATABASE_URL=<URL de la base de staging>
JWT_SECRET=$(openssl rand -hex 32)
EOF
open -e /tmp/staging.env                  # completar DATABASE_URL y agregar lo que falte; guardar
gh secret set ENV_FILE --env staging -R $BACK < /tmp/staging.env
rm /tmp/staging.env
```

💻 Puerto del frontend (es una **variable**, no un secreto; solo backend):

```bash
gh variable set HTTP_PORT --env staging -R $BACK --body "8081"
```

💻 Verificar:

```bash
gh secret list --env staging -R $BACK      # VPS_HOST, VPS_USER, VPS_SSH_KEY, VPS_KNOWN_HOSTS, ENV_FILE
gh variable list --env staging -R $BACK    # HTTP_PORT
gh secret list --env staging -R $FRONT     # VPS_HOST, VPS_USER, VPS_SSH_KEY, VPS_KNOWN_HOSTS
```

## Paso 9: Deployar a preprod (primero backend, después frontend)

💻 En la carpeta del **backend**:

```bash
git checkout main && git pull
git checkout preprod 2>/dev/null || git checkout -b preprod
git merge main
git push -u origin preprod
gh run watch -R $BACK          # elegir el run; muestra el progreso en vivo
```

Esperar a que termine en verde. Recién después, lo mismo en la carpeta del **frontend**:

```bash
git checkout main && git pull
git checkout preprod 2>/dev/null || git checkout -b preprod
git merge main
git push -u origin preprod
gh run watch -R $FRONT
```

## Paso 10: Verificar en el VPS

💻

```bash
ssh -i $KEY root@$IP 'cd /opt/clerkiva/staging && docker compose ps && curl -s http://127.0.0.1:8081/api/home'
```

Tienen que aparecer `backend` y `frontend` como `Up`, y `{"ok":true,...}`.

## Paso 11: Entrar a la app

💻 Desde la Mac (dejar la terminal abierta):

```bash
ssh -i $KEY -L 8081:127.0.0.1:8081 root@$IP
```

Desde otra PC (pide la contraseña de root de Vultr):

```bash
ssh -L 8081:127.0.0.1:8081 root@<IP>
```

Abrir **http://localhost:8081**. Para cortar: `exit`.

## Paso 12: Producción

💻 Crear `production` **con aprobación manual** (vos como revisor):

```bash
MY_ID=$(gh api user -q .id)
for R in $BACK $FRONT; do
  gh api -X PUT repos/$R/environments/production --input - <<EOF >/dev/null && echo "production OK en $R"
{"reviewers":[{"type":"User","id":$MY_ID}]}
EOF
done
```

💻 Secretos (igual que el paso 8, pero `--env production`):

```bash
for R in $BACK $FRONT; do
  gh secret set VPS_HOST        --env production -R $R --body "$IP"
  gh secret set VPS_USER        --env production -R $R --body "root"
  gh secret set VPS_SSH_KEY     --env production -R $R < $KEY
  ssh-keyscan $IP 2>/dev/null | gh secret set VPS_KNOWN_HOSTS --env production -R $R
done

cat > /tmp/production.env <<EOF
DATABASE_URL=<URL de la base de PRODUCCION>
JWT_SECRET=$(openssl rand -hex 32)
EOF
open -e /tmp/production.env
gh secret set ENV_FILE --env production -R $BACK < /tmp/production.env
rm /tmp/production.env

gh variable set HTTP_PORT --env production -R $BACK --body "8080"
```

💻 Deployar (backend primero, después frontend; en la carpeta de cada repo):

```bash
git checkout preprod && git pull
git checkout prod 2>/dev/null || git checkout -b prod
git merge preprod
git push -u origin prod
```

El job "Deploy al VPS" queda en **Waiting for review** → en GitHub: run → **Review deployments → Approve and deploy**.

💻 Entrar:

```bash
ssh -i $KEY -L 8080:127.0.0.1:8080 root@$IP     # abrir http://localhost:8080
```

---

## Comandos útiles

### GitHub Actions 💻

```bash
gh run list -R $BACK --limit 5            # últimos runs
gh run watch -R $BACK                     # seguir uno en vivo
gh run view <RUN_ID> -R $BACK --log-failed   # ver solo el error
gh run rerun <RUN_ID> -R $BACK --failed   # re-run de los jobs fallidos
gh run cancel <RUN_ID> -R $BACK           # cancelar
gh api -X POST repos/$BACK/actions/runs/<RUN_ID>/force-cancel   # cancelar aunque haya jobs con always()
```

### Contenedores 🖥️

```bash
cd /opt/clerkiva/staging                  # o /opt/clerkiva/production
docker compose ps                         # estado
docker compose logs -f backend            # logs en vivo (Ctrl+C para salir)
docker compose logs --tail 100 frontend
docker compose restart backend            # reiniciar
docker compose down                       # apagar el ambiente
docker compose up -d                      # levantarlo de nuevo
docker stats --no-stream                  # memoria/CPU de cada contenedor
```

### Volver a una versión anterior 🖥️

Cada build deja una imagen con el SHA del commit. Para volver a una:

```bash
cd /opt/clerkiva/staging
docker pull ghcr.io/<usuario-en-minusculas>/clerkiva-backend:<SHA>
docker tag  ghcr.io/<usuario-en-minusculas>/clerkiva-backend:<SHA> ghcr.io/<usuario-en-minusculas>/clerkiva-backend:preprod
docker compose up -d --no-deps backend
```

Los SHA disponibles están en GitHub → tu perfil → **Packages → clerkiva-backend**.

### Servidor 🖥️

```bash
df -h                     # espacio en disco
free -h                   # memoria
docker system prune -f    # borrar imágenes y contenedores sin usar
ufw status                # firewall
apt update && apt upgrade -y
```

### SSH 💻

```bash
ssh-keygen -R $IP                       # si aparece "REMOTE HOST IDENTIFICATION HAS CHANGED"
ssh-copy-id -i <clave>.pub root@$IP     # autorizar otra clave
```

---

## Si algo falla

| Error | Solución |
|---|---|
| `Missing SONAR_TOKEN` | Faltan los secretos del paso 2 |
| `Java 17 is not supported` | Usar `SonarSource/sonarqube-scan-action` en el workflow |
| Build y deploy "skipped" | Normal fuera de `preprod`/`prod` |
| Run trabado en "Waiting for a runner" | Mirar githubstatus.com y esperar |
| `Could not resolve hostname :` | Faltan `VPS_HOST`/`VPS_USER` en el environment (paso 8) |
| `Load key ...: error in libcrypto` | `VPS_SSH_KEY` mal cargada: `gh secret set VPS_SSH_KEY --env staging -R <repo> < $KEY` |
| `Permission denied (publickey,password)` | La clave pública no está en el VPS: `ssh-copy-id` (paso 6) |
| Deploy del frontend falla | Desplegar primero el backend, después `gh run rerun <RUN_ID> --failed` |

Para ver el error exacto de cualquier run: `gh run view <RUN_ID> -R <repo> --log-failed`.

## Antes de usar Clerkiva con datos reales

- [ ] Proteger los endpoints de la API (hoy solo `GET /auth` pide token).
- [ ] Cambiar la contraseña de root (`passwd` 🖥️) o desactivar el login con contraseña:
  ```bash
  echo 'PasswordAuthentication no' > /etc/ssh/sshd_config.d/00-no-password.conf && systemctl restart ssh
  ```
- [ ] Usar un usuario de deploy en vez de `root`.
- [ ] Agregar tests al CI.
