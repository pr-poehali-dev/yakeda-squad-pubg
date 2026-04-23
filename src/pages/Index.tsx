import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const MY_RANK = 89;

const generatePlayers = () => {
  const names = [
    "ShadowKnight", "NeonViper", "FrostByte", "IronClad", "CryptoWolf",
    "BlazePeak", "DarkMatter", "StormRise", "ArcLight", "VoidRunner",
    "GhostMode", "PixelDeath", "NightOwl", "RazorEdge", "ColdBlood",
    "SteelMind", "EchoKill", "ZeroGravity", "AcidRain", "BinaryGod",
    "RedShift", "CyberHawk", "DustDevil", "WarpSpeed", "IceBlink",
    "CoreBreak", "NullShot", "SilentRage", "HexCode", "PhaseShift",
    "TurboFlex", "LagKiller", "Quickdraw", "OverDrive", "MegaWatt",
    "SonicBoom", "DeadPixel", "DarkNode", "CritHit", "FullSend",
    "TopFragment", "RankOne", "AlphaWave", "BetaTest", "GammaRay",
    "OmegaForce", "NovaDrift", "PulseFire", "StrikeZone", "HardCarry",
    "NetKill", "AimBot9k", "FlickShot", "WallBang", "HeadshotKing",
    "MicroBurst", "NanoKill", "DataMine", "ByteWar", "CodeRed",
    "GridLock", "WarCraft", "SpecOps", "DropShot", "BunnyHop",
    "SpeedRun", "NoScope", "QuickPeek", "SideStep", "CounterPush",
    "FakeOut", "ClutchGod", "EcoRound", "ForceBoost", "BurstFire",
    "HoldLine", "SmokeScreen", "FlashBang", "Molotov", "GrenadeKing",
    "DefuseKing", "PlantMaster", "SpikeBomb", "OverWatch", "HighGround",
    "BootCamp", "ProLeague", "EliteTeam", "TopTier", "HighElo",
    "MEOW_PL", "RankGrind", "SoloQueue", "DuoStack", "Yakeda_Squad",
  ];

  return names.map((name, i) => ({
    rank: i + 1,
    name: i + 1 === MY_RANK ? "Yakeda_Squad" : name,
    isMe: i + 1 === MY_RANK,
    score: Math.round(18500 - i * 180 - Math.random() * 60),
    kd: parseFloat((3.8 - i * 0.03 + Math.random() * 0.15).toFixed(2)),
    wins: Math.round(320 - i * 3 + Math.floor(Math.random() * 10)),
    change: i < 15 ? Math.floor(Math.random() * 5) - 2 : Math.floor(Math.random() * 3) - 1,
  }));
};

const players = generatePlayers();

const VISIBLE_AROUND = 4;

const getRankColor = (rank: number) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-300";
  if (rank === 3) return "text-amber-600";
  return "text-muted-foreground";
};

const getRankBg = (rank: number) => {
  if (rank === 1) return "bg-yellow-400/8";
  if (rank === 2) return "bg-gray-300/5";
  if (rank === 3) return "bg-amber-600/6";
  return "";
};

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const start = useRef(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(start.current + (value - start.current) * eased));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return <>{display.toLocaleString("ru")}</>;
}

function PlayerRow({ player, delay, visible }: { player: ReturnType<typeof generatePlayers>[0]; delay: number; visible: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const changeIcon = player.change > 0 ? "TrendingUp" : player.change < 0 ? "TrendingDown" : "Minus";
  const changeColor = player.change > 0 ? "text-emerald-400" : player.change < 0 ? "text-red-400" : "text-muted-foreground";

  return (
    <div
      className={`
        relative flex items-center gap-4 px-5 py-3.5 rounded-lg transition-all
        ${player.isMe
          ? "player-row bg-accent/10 border border-accent/30"
          : `border border-transparent hover:border-border hover:bg-secondary/40 ${getRankBg(player.rank)}`
        }
        ${show ? "opacity-100" : "opacity-0"}
      `}
      style={{
        transform: show ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.35s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.35s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {player.isMe && (
        <div className="absolute inset-0 rounded-lg bg-accent/5 pointer-events-none" />
      )}

      <div className={`rank-badge w-9 text-right text-sm font-bold shrink-0 ${getRankColor(player.rank)}`}>
        {player.rank <= 3
          ? ["🥇", "🥈", "🥉"][player.rank - 1]
          : `#${player.rank}`}
      </div>

      <div className="flex-1 min-w-0">
        <span className={`text-sm font-semibold truncate block ${player.isMe ? "text-accent" : "text-foreground"}`}>
          {player.name}
        </span>
      </div>

      <div className={`flex items-center gap-1 w-12 justify-end ${changeColor}`}>
        <Icon name={changeIcon} size={12} />
        <span className="text-xs">{Math.abs(player.change)}</span>
      </div>

      <div className="hidden sm:block w-16 text-right">
        <span className="text-xs text-muted-foreground">K/D</span>
        <div className="text-sm font-medium text-foreground">{player.kd.toFixed(2)}</div>
      </div>

      <div className="hidden md:block w-16 text-right">
        <span className="text-xs text-muted-foreground">Побед</span>
        <div className="text-sm font-medium text-foreground">{player.wins}</div>
      </div>

      <div className="w-24 text-right">
        <span className="text-xs text-muted-foreground">Очки</span>
        <div className={`text-sm font-bold rank-badge ${player.isMe ? "text-accent" : "text-foreground"}`}>
          {visible ? <AnimatedNumber value={player.score} duration={900 + Math.random() * 400} /> : player.score.toLocaleString("ru")}
        </div>
      </div>
    </div>
  );
}

function Separator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2 px-5">
      <div className="h-px flex-1 bg-border/60" />
      <span className="text-xs text-muted-foreground/50 rank-badge">{label}</span>
      <div className="h-px flex-1 bg-border/60" />
    </div>
  );
}

export default function Index() {
  const [mounted, setMounted] = useState(false);
  const [animScores, setAnimScores] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setAnimScores(true), 300);
    return () => clearTimeout(t);
  }, []);

  const top = players.slice(0, 10);
  const around = players.slice(MY_RANK - 1 - VISIBLE_AROUND, MY_RANK + VISIBLE_AROUND);

  const myStats = players[MY_RANK - 1];

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div
          className="mb-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            willChange: "transform, opacity",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-4 mb-8">
            <img
              src="https://cdn.poehali.dev/projects/f0d2a78b-651c-4f48-a801-fc4a589d0970/files/7cd759dd-6527-488b-9d69-b5bc75d32c6c.jpg"
              alt="Yakeda Squad"
              className="w-14 h-14 rounded-xl object-cover border border-border/60"
              style={{ imageRendering: "crisp-edges" }}
            />
            <div>
              <div className="text-lg font-bold text-foreground tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: "0.12em" }}>
                Yakeda Squad
              </div>
              <div className="text-xs text-muted-foreground tracking-widest uppercase mt-0.5">PUBG Mobile</div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest rank-badge">Live</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: "'Space Mono', monospace" }}>
            ТАБЛИЦА<br />ЛИДЕРОВ
          </h1>
          <p className="text-muted-foreground text-sm mt-2">Глобальный рейтинг · {players.length} игроков</p>
        </div>

        {/* My stats card */}
        <div
          className="mb-8 p-5 rounded-xl border border-accent/30 bg-accent/5"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1) 80ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) 80ms",
            willChange: "transform, opacity",
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Ваша позиция</div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-accent rank-badge">#89</span>
                <span className="text-muted-foreground text-sm mb-1">из {players.length}</span>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Очки</div>
                <div className="text-xl font-bold text-foreground rank-badge">
                  {animScores ? <AnimatedNumber value={myStats.score} duration={1400} /> : myStats.score}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">K/D</div>
                <div className="text-xl font-bold text-foreground">{myStats.kd.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Побед</div>
                <div className="text-xl font-bold text-foreground">{myStats.wins}</div>
              </div>
            </div>
          </div>
        </div>

        {/* TOP 10 */}
        <div className="mb-2">
          <div
            className="flex items-center gap-2 mb-3 px-1"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.4s ease 150ms",
            }}
          >
            <Icon name="Trophy" size={14} className="text-accent" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Топ 10</span>
          </div>
          <div className="flex flex-col gap-1">
            {top.map((p, i) => (
              <PlayerRow key={p.rank} player={p} delay={160 + i * 40} visible={animScores} />
            ))}
          </div>
        </div>

        <Separator label="· · ·" />

        {/* Around me */}
        <div className="mb-2">
          <div
            className="flex items-center gap-2 mb-3 px-1"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.4s ease 300ms",
            }}
          >
            <Icon name="User" size={14} className="text-accent" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Ваше окружение</span>
          </div>
          <div className="flex flex-col gap-1">
            {around.map((p, i) => (
              <PlayerRow key={p.rank} player={p} delay={560 + i * 35} visible={animScores} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="mt-10 pt-6 border-t border-border/40 flex items-center justify-between"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.5s ease 900ms",
          }}
        >
          <span className="text-xs text-muted-foreground/50 rank-badge">Обновлено: сейчас</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-muted-foreground/50">Online</span>
          </div>
        </div>

      </div>
    </div>
  );
}