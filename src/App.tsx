import { useRef, useState } from 'react'
import { GlassPanel } from './GlassPanel'
import { useAmbientGlass, useMoscowClock, useSmoothScroll } from './Hooks'
import { GetResponseTime } from './Schedule'

function App() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)
  const [responseTime] = useState(GetResponseTime)
  const moscowTime = useMoscowClock()
  useAmbientGlass(bgCanvasRef)
  useSmoothScroll()

  return (
    <>
      {/* ambience canvas, first child of #root so glass refracts its live pixels */}
      <canvas ref={bgCanvasRef} className="bg-canvas" aria-hidden="true"></canvas>

      <div className="wrap">

        <section className="hero">
          <h1>Full-stack developer with <span className="yrs">5+ years</span> of experience</h1>
          <p className="lead">Best-in-class Roblox systems - scripts, UI, buildings, and game design - built to survive real player load, not just look good in a demo.</p>

          <div className="hero-meta">
            <GlassPanel intrinsic className="glass stat-card">
              <span className="num" id="response-time-num">{responseTime.num}</span>
              <span className="label" id="response-time-label">{responseTime.label}</span>
            </GlassPanel>
            <GlassPanel intrinsic className="glass stat-card">
              <span className="num">$5</span>
              <span className="label">Starting price</span>
            </GlassPanel>
            <GlassPanel intrinsic className="glass stat-card">
              <span className="num" id="moscow-time">{moscowTime}</span>
              <span className="label">Moscow timezone</span>
            </GlassPanel>
          </div>

          <div className="hero-links">
            <GlassPanel as="a" intrinsic id="discord-button" className="btn primary" href="https://discord.com/users/ParticleWaste" target="_blank" rel="noopener">Discord: ParticleWaste ↗</GlassPanel>
            <GlassPanel as="a" intrinsic id="github-button" className="btn" href="https://github.com/MidaxProductions" target="_blank" rel="noopener">GitHub</GlassPanel>
          </div>
        </section>

        <section id="why-me">
          <h2>Why work with me</h2>
          <GlassPanel className="why-card glass">
            <ul>
              <li>Available right now - almost always online, fast turnaround on delivered code</li>
              <li>Your code stays private - I don't reuse it for other clients</li>
              <li>Security and architecture are built into the systems from the start - I don't rely on client trust.</li>
              <li>5+ years of hands-on experience building gameplay systems for Roblox</li>
              <li>Guarantee on delivered code</li>
              <li>Low rates for the quality - simple tasks often done same day</li>
              <li className="minus">Not a native English speaker - written communication is solid, live calls are where I'm weaker</li>
            </ul>
          </GlassPanel>
        </section>

        <section id="focus">
          <h2>Areas of Expertise</h2>
          <div className="two-col">
            <GlassPanel className="col-card do glass">
              <h3>Do</h3>
              <ul>
                <li><b>Economy &amp; monetization</b> - shops, gamepasses, currencies, sinks, daily rewards</li>
                <li><b>Data persistence</b> - ProfileStore/Lapis, session-locking, anti-dupe systems</li>
                <li><b>Progression &amp; retention</b> - progression loops, quests, rewards, leaderboards</li>
                <li><b>Game flow</b> - round-based systems, queues, matchmaking</li>
                <li><b>Procedural generation</b> - systems that generate infinity (replayable) gameplay</li>
                <li><b>Any system, any scale</b> - I architect and deliver production-ready game systems from scratch</li>
              </ul>
            </GlassPanel>
            <GlassPanel className="col-card glass">
              <h3>I don't do / do less well</h3>
              <ul>
                <li>Don't use outdated frameworks in new work</li>
                <li>Weaker at combat / FPS-shooter systems - limited experience there</li>
                <li>Don't make 3D models. Only building.</li>
              </ul>
            </GlassPanel>
          </div>
          <p className="lead" style={{ marginTop: '18px' }}>Main focus ranges from <b>BEST horror experiences</b> to <b>high-retention, monetization-driven games</b>.</p>
        </section>

        <section id="stack">
          <h2>Stack</h2>
          <GlassPanel className="stack-list glass">
            <div className="stack-row">
              <div className="k">Languages</div>
              <div className="v"><b>Luau</b>, <b>Roblox-TS</b></div>
            </div>
            <div className="stack-row">
              <div className="k">Networking</div>
              <div className="v"><b>Default Remotes</b>, <b>Replica</b>, <b>Tether Serio</b>, <b>Buffers</b></div>
            </div>
            <div className="stack-row">
              <div className="k">State / ECS</div>
              <div className="v"><b>JECS</b>, <b>Matter</b>, <b>Charm</b> (for state), default OOP architectures</div>
            </div>
            <div className="stack-row">
              <div className="k">UI</div>
              <div className="v"><b>Vide</b>, <b>Fusion</b>, <b>React</b>, plain UI without a framework</div>
            </div>
            <div className="stack-row">
              <div className="k">Data storage</div>
              <div className="v"><b>ProfileStore</b>, <b>Lapis</b>, <b>DataStore2</b>, etc.</div>
            </div>
            <div className="stack-row">
              <div className="k">Principles</div>
              <div className="v"><b>SOLID</b>, <b>DRY</b>, <b>KISS</b>, <b>YAGNI</b></div>
            </div>
            <div className="stack-row">
              <div className="k">Collaboration</div>
              <div className="v">
                <div className="tools-row">
                  <span>Notion</span><span>Jira</span><span>Trello</span><span>Miro</span><span>Figma</span>
                </div>
              </div>
            </div>
          </GlassPanel>
        </section>

        <section id="services">
          <h2>Services</h2>
          <div className="services-list">
            <GlassPanel className="service-item glass">
              <div className="t">Lead developer &amp; game designer</div>
              <div className="d">I go through your project and give it to you straight - strengths, weaknesses, and where the risk is. That includes a market read against comparable games and a full bug list from actually playtesting your game myself, not just reading the code. You get a clear time and cost estimate scoped to your budget, plus recommendations on what to prioritize. Also, I take full responsibility for the development process - from distributing tasks to doing hands-on work within the team.</div>
            </GlassPanel>
            <GlassPanel className="service-item glass">
              <div className="t"><span style={{ background: 'rgba(255,176,32,.22)', color: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>AI-written code cleanup</span></div>
              <div className="d">Had ChatGPT or Claude write your systems and now they're falling apart under real players? Send it over, I don't care who wrote it. I'll sort what's usable, patch what's broken, and rewrite the rest.</div>
            </GlassPanel>
            <GlassPanel className="service-item glass">
              <div className="t">Full-stack developer</div>
              <div className="d">Cover a project end to end - scripts, UI, and buildings.</div>
            </GlassPanel>
          </div>
        </section>

        <section id="rates">
          <h2>Rates</h2>
          <p className="lead" style={{ marginBottom: '16px' }}><b>Available most of the time</b>, so turnaround is fast - simple fixes and small systems can be same-day. Prices below are starting points; final cost depends on scope.</p>

          <GlassPanel className="rates glass">
            <div className="rate-row">
              <span>System development</span>
              <span className="price">from $10</span>
            </div>
            <div className="rate-row">
              <span>Bug fixes</span>
              <span className="price">from $5</span>
            </div>
            <div className="rate-row">
              <span>Payment deposit</span>
              <span className="price">25%, capped at $50</span>
            </div>
            <div className="rate-row">
              <span>Time estimate</span>
              <span className="price">given upfront, before work starts</span>
            </div>
          </GlassPanel>

          <div className="payment-methods">
            <span>Cryptocurrency</span><span>Kast</span><span>Robux (+30% Roblox commission)</span>
          </div>
        </section>

        <section id="guarantee">
          <h2>Guarantee</h2>
          <GlassPanel className="guarantee-box glass">
            <p><b>14-day</b> guarantee on the code working correctly after delivery. If something breaks within that window, I fix it for free. This doesn't cover adding new logic on top of the delivered work.</p>
          </GlassPanel>
        </section>

        <section id="projects">
          <h2>Examples</h2>
          <GlassPanel className="project glass">
            <h3>NullRooms (Solo-Project)</h3>
            <div className="video-embed">
              <iframe
                src="https://www.youtube.com/embed/oM3S-qifWBM"
                title="YouTube video"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen>
              </iframe>
            </div>
            <a className="video-link" href="https://youtu.be/oM3S-qifWBM" target="_blank" rel="noopener">
              Open this video on YouTube ↗
            </a>
          </GlassPanel>
        </section>

        <section id="contact">
          <h2>Contact</h2>
          <div className="contact-list">
            <span className="contact-text">github.com/MidaxProductions</span>
            <span className="contact-text">ParticleWaste (Discord & Roblox)</span>
            <span className="contact-text">ParticleWaste@proton.me</span>
          </div>
        </section>

      </div>

      <footer></footer>
    </>
  )
}

export default App