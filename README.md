# Civic Snap

Citizens roads, water, current, school building laanti samasyalaki photo/video + GPS location tho post chestaru. Samasya aa department ki velthundi. Public dashboard lo prathi department ki total / pending / in progress / resolved counts login lekunda kanipistayi.

**Stack:** Spring Boot 3 (Java 17+) + JPA + JWT, React (Vite), Leaflet + OpenStreetMap (free, API key avasaram ledu), Telugu / Hindi / English.

## Roles (andariki Instagram laanti profile undi)

| Role | Em cheyagalaru | Profile lo emi chupistundi |
|---|---|---|
| **Citizen** | Signup, issue post, upvote ("Support"), profile edit | Posts grid, entha resolve ayyayi |
| **Officer** | Tana department issues status maarchagalaru (Pending / In progress / Resolved) | Department, posts, entha resolve chesaru |
| **Collector** | Anni departments issues status maarchagalaru | Bio, posts, resolved count + **anni departments dashboard table** |
| **Public** (login ledu) | Feed, dashboard, map, profiles chudadam | |

Public signup eppudu Citizen ye. Officer/Collector accounts seed lo create avutayi (`DataSeeder.java`), evaraina Collector ayipokunda.

## Run cheyyadam

**1. Backend** (terminal 1):
```
cd backend
mvn spring-boot:run
```
Port 8080. Modati run lo departments + demo users + 5 sample issues create avutayi. Database: H2 file (`backend/data/`), extra install avasaram ledu. PostgreSQL kosam `application.properties` lo comments maarchandi.

**2. Frontend** (terminal 2):
```
cd frontend
npm install
npm run dev
```
http://localhost:5173 open cheyyandi. `/api` requests vite proxy dwara 8080 ki veltayi.

## Demo logins (password: `demo123`)

- Collector: `collector@civic.in`
- Officers: `roads@civic.in`, `water@civic.in`, `electricity@civic.in`, `schools@civic.in`, `sanitation@civic.in`, `health@civic.in`
- Citizens: `asha@example.com`, `ravi@example.com`

**Deploy mundu:** passwords, `JWT_SECRET` env variable maarchandi.

## Interview lo ela cheppali

- **Duplicate check:** same department, 100 m lopala, last 30 rojullo, inka resolve kaani issue unte "already reported, support cheyyandi" ani chupistundi. Bounding-box DB query + haversine distance. (`IssueController.nearby`)
- **Status integrity:** Officer tana department ki matrame, collector andariki. Server lo check chestundi, frontend lo kaadu. (`IssueController.status`)
- **Security:** BCrypt passwords, JWT, upload type whitelist (jpg/png/webp/mp4/webm), random filenames, map popups lo HTML escape.
- **Upvote:** oka user oka issue ki oka sari matrame (DB unique constraint).
- **Multilingual:** `frontend/src/i18n.jsx`. Department names code batti translate avutayi.

## Honest limitations

- **Backend ni nenu ikkada compile/run cheyyaledu** (sandbox lo Maven Central block undi). Code careful ga review chesanu, kani mee laptop lo modati `mvn spring-boot:run` lo chinna error vasthe paste cheyyandi, fix chestanu. Frontend build matram test chesanu (`npm run build` pass).
- Map tiles ki internet kavali (OpenStreetMap).
- Address manual ga type cheyyali (reverse-geocoding add cheyyaledu).
- Uploads server disk lo save avutayi (production ki S3/cloud storage better).
- Ee version lo **AI summary** ledu. Next step: `/api/summary?departmentId=` endpoint, Claude API tho top issues summary.
- Notifications (email/SMS to officer) ledu. Ippudu officer login chesi feed chudali.
