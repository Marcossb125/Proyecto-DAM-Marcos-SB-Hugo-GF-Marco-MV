# ===========================================================
# TEST SCRIPT - API REST Convergence
# Ejecutar desde PowerShell con el servidor Spring Boot activo
# Uso: .\test_api.ps1
# NOTA: Ajusta $BACKEND_USER y $BACKEND_PASS si son diferentes
# ===========================================================

$BASE_URL      = "http://localhost:8080"
$BACKEND_USER  = "backend"          # valor de backend.auth.username en application.properties
$BACKEND_PASS  = "backend123"       # valor de backend.auth.password en application.properties
$global:PASS_COUNT = 0
$global:FAIL_COUNT = 0

function Write-Pass($msg) { Write-Host "  [PASS] $msg" -ForegroundColor Green;  $global:PASS_COUNT++ }
function Write-Fail($msg) { Write-Host "  [FAIL] $msg" -ForegroundColor Red;    $global:FAIL_COUNT++ }
function Write-Section($title) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  $title" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
}

# Helper HTTP — devuelve @{Status; Content} sin lanzar excepcion
function Invoke-Api {
    param($Method, $Url, $Body = $null)
    $headers = @{ "Content-Type" = "application/json" }
    try {
        if ($Body) {
            $resp = Invoke-WebRequest -Method $Method -Uri $Url `
                -Headers $headers -Body ($Body | ConvertTo-Json -Depth 10) `
                -ErrorAction Stop
        } else {
            $resp = Invoke-WebRequest -Method $Method -Uri $Url `
                -Headers $headers -ErrorAction Stop
        }
        return @{ Status = $resp.StatusCode; Content = $resp.Content }
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
        $body = ""
        try { $body = [System.IO.StreamReader]::new(
                  $_.Exception.Response.GetResponseStream()).ReadToEnd() } catch {}
        return @{ Status = $code; Content = $body }
    }
}

# --- Usuarios y nombres unicos por timestamp para no colisionar ---
$TS         = Get-Date -Format "HHmmss"
$NICK1      = "testuser_$TS"
$NICK2      = "testuser2_$TS"
$EMAIL1     = "$NICK1@test.com"
$EMAIL2     = "$NICK2@test.com"
$MATCH_NAME = "partida_test_$TS"

Write-Host ""
Write-Host "  Usuarios de prueba : $NICK1  /  $NICK2" -ForegroundColor Yellow
Write-Host "  Partida de prueba  : $MATCH_NAME"        -ForegroundColor Yellow

# ===========================================================
# 1. AUTH CONTROLLER  /auth
# ===========================================================
Write-Section "1. AuthController  (/auth)"

# 1.1 Registro exitoso (200)
$r = Invoke-Api "POST" "$BASE_URL/auth/register" @{
    nickname = $NICK1; password = "password123"; email = $EMAIL1 }
if ($r.Status -eq 200) { Write-Pass "POST /auth/register - Registro OK (200)" }
else { Write-Fail "POST /auth/register - Esperado 200, obtenido $($r.Status): $($r.Content)" }

# 1.2 Registro duplicado (409)
$r = Invoke-Api "POST" "$BASE_URL/auth/register" @{
    nickname = $NICK1; password = "otrapass"; email = $EMAIL1 }
if ($r.Status -eq 409) { Write-Pass "POST /auth/register (duplicado) - 409 OK" }
else { Write-Fail "POST /auth/register (duplicado) - Esperado 409, obtenido $($r.Status)" }

# 1.3 Registro sin campos obligatorios (400)
$r = Invoke-Api "POST" "$BASE_URL/auth/register" @{ nickname = "solo_nick" }
if ($r.Status -eq 400) { Write-Pass "POST /auth/register (sin email/pass) - 400 OK" }
else { Write-Fail "POST /auth/register (sin campos) - Esperado 400, obtenido $($r.Status)" }

# 1.4 Login exitoso (200)
$r = Invoke-Api "POST" "$BASE_URL/auth/login" @{
    nickname = $NICK1; password = "password123" }
if ($r.Status -eq 200) { Write-Pass "POST /auth/login - Login OK (200)" }
else { Write-Fail "POST /auth/login - Esperado 200, obtenido $($r.Status): $($r.Content)" }

# 1.5 Login contrasena incorrecta (401)
$r = Invoke-Api "POST" "$BASE_URL/auth/login" @{
    nickname = $NICK1; password = "wrongpassword" }
if ($r.Status -eq 401) { Write-Pass "POST /auth/login (pass incorrecta) - 401 OK" }
else { Write-Fail "POST /auth/login (pass incorrecta) - Esperado 401, obtenido $($r.Status)" }

# 1.6 Login usuario inexistente (404)
$r = Invoke-Api "POST" "$BASE_URL/auth/login" @{
    nickname = "noexiste_$TS"; password = "password123" }
if ($r.Status -eq 404) { Write-Pass "POST /auth/login (usuario no existe) - 404 OK" }
else { Write-Fail "POST /auth/login (usuario no existe) - Esperado 404, obtenido $($r.Status)" }

# 1.7 Backend login -> JWT (200)
$r = Invoke-Api "POST" "$BASE_URL/auth/backend-login" @{
    nickname = $BACKEND_USER; password = $BACKEND_PASS }
if ($r.Status -eq 200) {
    Write-Pass "POST /auth/backend-login - JWT obtenido (200)"
    $tok = ($r.Content | ConvertFrom-Json).token
    if ($tok) { Write-Host "    Token (primeros 40 chars): $($tok.Substring(0,[Math]::Min(40,$tok.Length)))..." -ForegroundColor DarkGray }
} else {
    Write-Fail "POST /auth/backend-login - Esperado 200, obtenido $($r.Status): $($r.Content)"
}

# 1.8 Backend login credenciales incorrectas (401)
$r = Invoke-Api "POST" "$BASE_URL/auth/backend-login" @{
    nickname = "backend"; password = "wrongpass" }
if ($r.Status -eq 401) { Write-Pass "POST /auth/backend-login (creds incorrectas) - 401 OK" }
else { Write-Fail "POST /auth/backend-login (creds incorrectas) - Esperado 401, obtenido $($r.Status)" }

# ===========================================================
# 2. GENERAL CONTROLLER  /general
# ===========================================================
Write-Section "2. GeneralController  (/general)"

# Registrar segundo usuario
Invoke-Api "POST" "$BASE_URL/auth/register" @{
    nickname = $NICK2; password = "password123"; email = $EMAIL2 } | Out-Null

# 2.1 Guardar general (200)
$r = Invoke-Api "PUT" "$BASE_URL/general/guardar" @{
    nickname = $NICK1; generalId = 3 }
if ($r.Status -eq 200) { Write-Pass "PUT /general/guardar - General guardado (200)" }
else { Write-Fail "PUT /general/guardar - Esperado 200, obtenido $($r.Status): $($r.Content)" }

# 2.2 Obtener general (200)
$r = Invoke-Api "GET" "$BASE_URL/general/$NICK1"
if ($r.Status -eq 200) {
    Write-Pass "GET /general/{nickname} - General obtenido (200)"
    Write-Host "    Respuesta: $($r.Content)" -ForegroundColor DarkGray
} else { Write-Fail "GET /general/{nickname} - Esperado 200, obtenido $($r.Status)" }

# 2.3 Sin nickname (400)
$r = Invoke-Api "PUT" "$BASE_URL/general/guardar" @{ generalId = 1 }
if ($r.Status -eq 400) { Write-Pass "PUT /general/guardar (sin nickname) - 400 OK" }
else { Write-Fail "PUT /general/guardar (sin nickname) - Esperado 400, obtenido $($r.Status)" }

# 2.4 Usuario inexistente (404)
$r = Invoke-Api "GET" "$BASE_URL/general/noexiste_$TS"
if ($r.Status -eq 404) { Write-Pass "GET /general/{nickname} (no existe) - 404 OK" }
else { Write-Fail "GET /general/{nickname} (no existe) - Esperado 404, obtenido $($r.Status)" }

# ===========================================================
# 3. BANDERA CONTROLLER  /bandera
# ===========================================================
Write-Section "3. BanderaController  (/bandera)"

# 3.1 Guardar bandera (200)
$r = Invoke-Api "PUT" "$BASE_URL/bandera/guardar" @{
    nickname = $NICK1
    nombre   = "Faccion Test"
    bandera  = @{ layout = "diagonal"; colors = @("#FF0000","#FFFFFF","#0000FF") }
}
if ($r.Status -eq 200) {
    Write-Pass "PUT /bandera/guardar - Bandera guardada (200)"
    Write-Host "    Respuesta: $($r.Content)" -ForegroundColor DarkGray
} else { Write-Fail "PUT /bandera/guardar - Esperado 200, obtenido $($r.Status): $($r.Content)" }

# 3.2 Obtener bandera (200)
$r = Invoke-Api "GET" "$BASE_URL/bandera/$NICK1"
if ($r.Status -eq 200) {
    Write-Pass "GET /bandera/{nickname} - Bandera obtenida (200)"
    Write-Host "    Respuesta: $($r.Content)" -ForegroundColor DarkGray
} else { Write-Fail "GET /bandera/{nickname} - Esperado 200, obtenido $($r.Status)" }

# 3.3 Sin nickname (400)
$r = Invoke-Api "PUT" "$BASE_URL/bandera/guardar" @{
    bandera = @{ layout = "solid"; colors = @("#000000") } }
if ($r.Status -eq 400) { Write-Pass "PUT /bandera/guardar (sin nickname) - 400 OK" }
else { Write-Fail "PUT /bandera/guardar (sin nickname) - Esperado 400, obtenido $($r.Status)" }

# 3.4 Sin objeto bandera (400)
$r = Invoke-Api "PUT" "$BASE_URL/bandera/guardar" @{
    nickname = $NICK1; nombre = "Sin bandera" }
if ($r.Status -eq 400) { Write-Pass "PUT /bandera/guardar (sin bandera) - 400 OK" }
else { Write-Fail "PUT /bandera/guardar (sin bandera) - Esperado 400, obtenido $($r.Status)" }

# 3.5 Usuario inexistente (404)
$r = Invoke-Api "GET" "$BASE_URL/bandera/noexiste_$TS"
if ($r.Status -eq 404) { Write-Pass "GET /bandera/{nickname} (no existe) - 404 OK" }
else { Write-Fail "GET /bandera/{nickname} (no existe) - Esperado 404, obtenido $($r.Status)" }

# ===========================================================
# 4. PARTIDA CONTROLLER  /partidas
# ===========================================================
Write-Section "4. PartidaController  (/partidas)"

# 4.1 Crear partida (200)
$r = Invoke-Api "POST" "$BASE_URL/partidas/crear" @{
    nombre = $MATCH_NAME; jugadores_limite = 4; hostNombre = $NICK1 }
$MATCH_ID = $null
if ($r.Status -eq 200) {
    $MATCH_ID = ($r.Content | ConvertFrom-Json).id
    Write-Pass "POST /partidas/crear - Partida creada (200) ID=$MATCH_ID"
} else { Write-Fail "POST /partidas/crear - Esperado 200, obtenido $($r.Status): $($r.Content)" }

# 4.2 Partida duplicada (409)
$r = Invoke-Api "POST" "$BASE_URL/partidas/crear" @{
    nombre = $MATCH_NAME; jugadores_limite = 4; hostNombre = $NICK1 }
if ($r.Status -eq 409) { Write-Pass "POST /partidas/crear (duplicada) - 409 OK" }
else { Write-Fail "POST /partidas/crear (duplicada) - Esperado 409, obtenido $($r.Status)" }

# 4.3 Host inexistente (404)
$r = Invoke-Api "POST" "$BASE_URL/partidas/crear" @{
    nombre = "otra_$TS"; jugadores_limite = 2; hostNombre = "noexiste_$TS" }
if ($r.Status -eq 404) { Write-Pass "POST /partidas/crear (host no existe) - 404 OK" }
else { Write-Fail "POST /partidas/crear (host no existe) - Esperado 404, obtenido $($r.Status)" }

# 4.4 Obtener por ID (200)
if ($MATCH_ID) {
    $r = Invoke-Api "GET" "$BASE_URL/partidas/$MATCH_ID"
    if ($r.Status -eq 200) { Write-Pass "GET /partidas/{id} - Partida obtenida (200)" }
    else { Write-Fail "GET /partidas/{id} - Esperado 200, obtenido $($r.Status)" }
} else { Write-Fail "GET /partidas/{id} - Saltado (no hay MATCH_ID)" }

# 4.5 Obtener por nombre (200)
$r = Invoke-Api "GET" "$BASE_URL/partidas/nombre/$MATCH_NAME"
if ($r.Status -eq 200) { Write-Pass "GET /partidas/nombre/{nombre} - Partida encontrada (200)" }
else { Write-Fail "GET /partidas/nombre/{nombre} - Esperado 200, obtenido $($r.Status)" }

# 4.6 Partidas del usuario (200)
$r = Invoke-Api "GET" "$BASE_URL/partidas/usuario/$NICK1"
if ($r.Status -eq 200) {
    Write-Pass "GET /partidas/usuario/{nickname} - Lista OK (200)"
    Write-Host "    Partidas: $(($r.Content | ConvertFrom-Json).Count)" -ForegroundColor DarkGray
} else { Write-Fail "GET /partidas/usuario/{nickname} - Esperado 200, obtenido $($r.Status)" }

# 4.7 Unirse a la partida (200)
if ($MATCH_ID) {
    $r = Invoke-Api "POST" "$BASE_URL/partidas/$MATCH_ID/unirse?nickname=$NICK2"
    if ($r.Status -eq 200) { Write-Pass "POST /partidas/{id}/unirse - NICK2 unido (200)" }
    else { Write-Fail "POST /partidas/{id}/unirse - Esperado 200, obtenido $($r.Status): $($r.Content)" }
}

# 4.8 Partidas activas (200)
$r = Invoke-Api "GET" "$BASE_URL/partidas/buscar/activas"
if ($r.Status -eq 200) {
    Write-Pass "GET /partidas/buscar/activas - Lista obtenida (200)"
    Write-Host "    Partidas activas: $(($r.Content | ConvertFrom-Json).Count)" -ForegroundColor DarkGray
} else { Write-Fail "GET /partidas/buscar/activas - Esperado 200, obtenido $($r.Status)" }

# 4.9 ID inexistente (404)
$r = Invoke-Api "GET" "$BASE_URL/partidas/999999"
if ($r.Status -eq 404) { Write-Pass "GET /partidas/{id} (no existe) - 404 OK" }
else { Write-Fail "GET /partidas/{id} (no existe) - Esperado 404, obtenido $($r.Status)" }

# 4.10 Borrar por no-host (403)
if ($MATCH_ID) {
    $r = Invoke-Api "DELETE" "$BASE_URL/partidas/${MATCH_ID}?requester=$NICK2"
    if ($r.Status -eq 403) { Write-Pass "DELETE /partidas/{id} (no-host) - 403 OK" }
    else { Write-Fail "DELETE /partidas/{id} (no-host) - Esperado 403, obtenido $($r.Status)" }

    # 4.11 Borrar por host (200)
    $r = Invoke-Api "DELETE" "$BASE_URL/partidas/${MATCH_ID}?requester=$NICK1"
    if ($r.Status -eq 200) { Write-Pass "DELETE /partidas/{id} (host) - Borrada OK (200)" }
    else { Write-Fail "DELETE /partidas/{id} (host) - Esperado 200, obtenido $($r.Status): $($r.Content)" }
}

# ===========================================================
# 5. SNAPSHOT CONTROLLER  /snapshots
# ===========================================================
Write-Section "5. SnapshotController  (/snapshots)"

# Crear nueva partida para snapshots
$SNAP_MATCH = "snap_$TS"
$r = Invoke-Api "POST" "$BASE_URL/partidas/crear" @{
    nombre = $SNAP_MATCH; jugadores_limite = 2; hostNombre = $NICK1 }
$SNAP_ID = $null
if ($r.Status -eq 200) {
    $SNAP_ID = ($r.Content | ConvertFrom-Json).id
    Write-Host "  Partida para snapshots creada (ID: $SNAP_ID)" -ForegroundColor DarkGray
} else {
    Write-Fail "Snapshots setup - No se pudo crear partida ($($r.Status))"
}

if ($SNAP_ID) {
    # 5.1 Guardar snapshot ronda 1
    $r = Invoke-Api "POST" "$BASE_URL/snapshots/guardar" @{
        matchId   = $SNAP_ID
        ronda     = 1
        stateJson = '{"turno":1,"recursos":{"oro":100,"madera":50}}'
        idHost    = $NICK1
        idGanador = ""
    }
    if ($r.Status -eq 200) { Write-Pass "POST /snapshots/guardar (ronda 1) - Guardado (200)" }
    else { Write-Fail "POST /snapshots/guardar (ronda 1) - Esperado 200, obtenido $($r.Status): $($r.Content)" }

    # 5.2 Guardar snapshot ronda 2 (update del mismo match)
    $r = Invoke-Api "POST" "$BASE_URL/snapshots/guardar" @{
        matchId   = $SNAP_ID
        ronda     = 2
        stateJson = '{"turno":2,"recursos":{"oro":200,"madera":80}}'
        idHost    = $NICK1
        idGanador = ""
    }
    if ($r.Status -eq 200) { Write-Pass "POST /snapshots/guardar (ronda 2) - Guardado (200)" }
    else { Write-Fail "POST /snapshots/guardar (ronda 2) - Esperado 200, obtenido $($r.Status)" }

    # 5.3 Obtener por ronda
    $r = Invoke-Api "GET" "$BASE_URL/snapshots/match/$SNAP_ID/ronda/1"
    if ($r.Status -eq 200) { Write-Pass "GET /snapshots/match/{id}/ronda/{n} - Snapshot obtenido (200)" }
    else { Write-Fail "GET /snapshots/match/{id}/ronda/{n} - Esperado 200, obtenido $($r.Status)" }

    # 5.4 Obtener ultimo snapshot
    $r = Invoke-Api "GET" "$BASE_URL/snapshots/match/$SNAP_ID/latest"
    if ($r.Status -eq 200) {
        Write-Pass "GET /snapshots/match/{id}/latest - Ultimo snapshot (200)"
        Write-Host "    Contenido: $($r.Content)" -ForegroundColor DarkGray
    } else { Write-Fail "GET /snapshots/match/{id}/latest - Esperado 200, obtenido $($r.Status)" }

    # 5.5 Guardar snapshot con ganador -> partida pasa a Finalizada
    $r = Invoke-Api "POST" "$BASE_URL/snapshots/guardar" @{
        matchId   = $SNAP_ID
        ronda     = 3
        stateJson = '{"turno":3,"fin":true}'
        idHost    = $NICK1
        idGanador = $NICK1
    }
    if ($r.Status -eq 200) { Write-Pass "POST /snapshots/guardar (con ganador) - Finalizado (200)" }
    else { Write-Fail "POST /snapshots/guardar (con ganador) - Esperado 200, obtenido $($r.Status): $($r.Content)" }
}

# 5.6 Snapshot inexistente (404)
$r = Invoke-Api "GET" "$BASE_URL/snapshots/match/999999/ronda/99"
if ($r.Status -eq 404) { Write-Pass "GET /snapshots/match/{id}/ronda/{n} (no existe) - 404 OK" }
else { Write-Fail "GET /snapshots/match/{id}/ronda/{n} (no existe) - Esperado 404, obtenido $($r.Status)" }

# 5.7 Sin campos obligatorios (400)
$r = Invoke-Api "POST" "$BASE_URL/snapshots/guardar" @{ ronda = 1 }
if ($r.Status -eq 400) { Write-Pass "POST /snapshots/guardar (sin campos) - 400 OK" }
else { Write-Fail "POST /snapshots/guardar (sin campos) - Esperado 400, obtenido $($r.Status)" }

# ===========================================================
# 6. RANKING CONTROLLER  /ranking
# ===========================================================
Write-Section "6. RankingController  (/ranking)"

# 6.1 Ranking general (200)
$r = Invoke-Api "GET" "$BASE_URL/ranking"
if ($r.Status -eq 200) {
    Write-Pass "GET /ranking - Lista de ranking (200)"
    $arr = $r.Content | ConvertFrom-Json
    Write-Host "    Usuarios en ranking: $($arr.Count)" -ForegroundColor DarkGray
} else { Write-Fail "GET /ranking - Esperado 200, obtenido $($r.Status)" }

# 6.2 Victorias totales de un general (200)
$r = Invoke-Api "GET" "$BASE_URL/ranking/general/3"
if ($r.Status -eq 200) {
    Write-Pass "GET /ranking/general/{id} - Victorias del general (200)"
    Write-Host "    Total victorias general 3: $($r.Content)" -ForegroundColor DarkGray
} else { Write-Fail "GET /ranking/general/{id} - Esperado 200, obtenido $($r.Status)" }

# 6.3 Perfil de usuario por nickname (200)
$r = Invoke-Api "GET" "$BASE_URL/ranking/user/$NICK1"
if ($r.Status -eq 200) {
    Write-Pass "GET /ranking/user/{nickname} - Perfil obtenido (200)"
    Write-Host "    Perfil: $($r.Content)" -ForegroundColor DarkGray
} else { Write-Fail "GET /ranking/user/{nickname} - Esperado 200, obtenido $($r.Status)" }

# ===========================================================
# 7. SYNC CONTROLLER  /sync
# ===========================================================
Write-Section "7. SyncController  (/sync)"

# 7.1 Sync all
$r = Invoke-Api "GET" "$BASE_URL/sync/all"
if ($r.Status -eq 200) {
    Write-Pass "GET /sync/all - Volcado completo SQL -> MongoDB (200)"
    Write-Host "    Resultado: $($r.Content)" -ForegroundColor DarkGray
} else { Write-Fail "GET /sync/all - Esperado 200, obtenido $($r.Status): $($r.Content)" }

# 7.2 Sync solo usuarios
$r = Invoke-Api "GET" "$BASE_URL/sync/usuarios"
if ($r.Status -eq 200) { Write-Pass "GET /sync/usuarios - Sincronizados (200)" }
else { Write-Fail "GET /sync/usuarios - Esperado 200, obtenido $($r.Status)" }

# 7.3 Sync solo partidas
$r = Invoke-Api "GET" "$BASE_URL/sync/partidas"
if ($r.Status -eq 200) { Write-Pass "GET /sync/partidas - Sincronizadas (200)" }
else { Write-Fail "GET /sync/partidas - Esperado 200, obtenido $($r.Status)" }

# 7.4 Sync solo snapshots
$r = Invoke-Api "GET" "$BASE_URL/sync/snapshots"
if ($r.Status -eq 200) { Write-Pass "GET /sync/snapshots - Sincronizados (200)" }
else { Write-Fail "GET /sync/snapshots - Esperado 200, obtenido $($r.Status)" }

# ===========================================================
# RESUMEN FINAL
# ===========================================================
Write-Host ""
Write-Host "==========================================" -ForegroundColor White
Write-Host "  RESUMEN FINAL" -ForegroundColor White
Write-Host "==========================================" -ForegroundColor White
Write-Host "  [PASS] $global:PASS_COUNT" -ForegroundColor Green
Write-Host "  [FAIL] $global:FAIL_COUNT" -ForegroundColor Red
Write-Host "  Total  $($global:PASS_COUNT + $global:FAIL_COUNT)"
if ($global:FAIL_COUNT -eq 0) {
    Write-Host ""
    Write-Host "  *** TODOS LOS TESTS PASARON ***" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "  *** REVISA LOS TESTS FALLIDOS ARRIBA ***" -ForegroundColor Yellow
}
Write-Host ""
