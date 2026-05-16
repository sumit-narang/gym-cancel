const BASE = import.meta.env.BASE_URL

// Two rows of 5, with varied heights to look natural
const LOGOS = [
  { file: 'logo1.svg',  h: 38 },
  { file: 'logo2.svg',  h: 32 },
  { file: 'logo3.svg',  h: 44 },
  { file: 'logo4.svg',  h: 44 },
  { file: 'logo5.svg',  h: 34 },
  { file: 'logo6.svg',  h: 28 },
  { file: 'logo7.svg',  h: 40 },
  { file: 'logo8.svg',  h: 48 },
  { file: 'logo9.svg',  h: 38 },
  { file: 'logo10.svg', h: 48 },
]

const ROW1 = LOGOS.slice(0, 5)
const ROW2 = LOGOS.slice(5, 10)

function LogoRow({ logos, startDelay }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48 }}>
      {logos.map(({ file, h }, i) => {
        const delay = startDelay + i * 60
        return (
          <img
            key={file}
            src={`${BASE}logo/${file}`}
            alt=""
            style={{
              height: h,
              width: 'auto',
              opacity: 0,
              filter: 'brightness(0)',
              animation: `stickerFadeIn 550ms cubic-bezier(0.22,1,0.36,1) ${delay}ms forwards, stickerBobIn 500ms cubic-bezier(0.34,1.35,0.64,1) ${delay}ms forwards`,
            }}
          />
        )
      })}
    </div>
  )
}

export default function LogoWall() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
      <LogoRow logos={ROW1} startDelay={0} />
      <LogoRow logos={ROW2} startDelay={100} />
    </div>
  )
}
