# Kritical Mining Platform

🪙 **Casa 13hs** - Minería de Tokens Kritical en Red BNB

## Características Principales

### ⛏️ Minería
- Ciclo de minería cada **12 horas**
- Sistema de **halving automático** cada 1M de usuarios
- Duración total de minería: **1 año y medio (1.5 años)**
- Supply total: **1 Billón (1B) de tokens**
- Tokens permanecen en wallet después de cada ciclo

### 👥 Referidos
- Gana **10% de lo minado** por tus referidos
- Sistema de códigos de referencia únicos
- Historial completo de referidos y ganancias

### 💰 Staking
- Bloquea tus tokens para ganar recompensas
- APY inicial: **12% anual**
- Retiros flexibles en cualquier momento

### 🔐 Autenticación
- Login con **Google**
- Registro con Email/Contraseña
- JWT Tokens seguros

### 💼 Wallet
- Wallet propia integrada
- Conexión a MetaMask/BNB Wallet
- Retiros a Red BNB (próximamente)

## Instalación

### Backend
```bash
npm install
cp .env.example .env
# Configura tus variables de entorno
npm start
```

### Frontend (React)
```bash
cd client
npm install
npm start
```

## Estructura del Proyecto

```
├── models/
│   ├── User.js
│   └── MiningStats.js
├── routes/
│   ├── auth.js
│   ├── mining.js
│   ├── wallet.js
│   ├── staking.js
│   └── referral.js
├── server.js
└── package.json
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Registro con email
- `POST /api/auth/google` - Login con Google
- `POST /api/auth/login` - Login con email

### Mining
- `POST /api/mining/start` - Iniciar minería
- `POST /api/mining/claim` - Reclamar recompensas
- `GET /api/mining/stats/:userId` - Obtener estadísticas

### Wallet
- `GET /api/wallet/balance` - Ver balance
- `POST /api/wallet/connect-bnb` - Conectar wallet BNB
- `POST /api/wallet/withdraw` - Retirar a BNB

### Staking
- `POST /api/staking/stake` - Hacer staking
- `POST /api/staking/claim-rewards` - Reclamar recompensas
- `POST /api/staking/unstake` - Deshacer staking
- `GET /api/staking/info` - Información de staking

### Referral
- `GET /api/referral/code` - Obtener código de referencia
- `POST /api/referral/join` - Unirse con código
- `GET /api/referral/stats` - Estadísticas de referidos

## Configuración de Variables de Entorno

```env
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
BNB_RPC_URL=https://bsc-dataseed.binance.org:443
CONTRACT_ADDRESS=0x...
PORT=5000
```

## Próximas Características

- [ ] Interfaz Web completa (React)
- [ ] Integración Web3 para transacciones BNB
- [ ] Smart Contract en BNB
- [ ] Whitepaper completo
- [ ] Dashboard en tiempo real
- [ ] Sistema de notificaciones
- [ ] Leaderboard de mineros
- [ ] App móvil

## Licencia

MIT

---

**Kritical - Casa 13hs** ⛏️💎