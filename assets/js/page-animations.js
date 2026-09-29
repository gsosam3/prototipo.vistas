(function(){
  class BasePageAnimation {
    constructor(options={}){
      this.page=options.page||'';
      this.className=options.className||'';
      this.delay=options.delay??170;
      this.leaveAt=options.leaveAt??1050;
      this.removeAt=options.removeAt??1350;
      this.toast=options.toast||null;
      this.ui=options.ui||window.TorneoUI||{};
      this.node=null;
    }
    canRun(){
      return document.body.dataset.page===this.page &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    template(){ return ''; }
    afterMount(){}
    play(){
      if(!this.canRun() || document.querySelector('.'+this.className)) return;
      window.setTimeout(()=>{
        if(!this.canRun()) return;
        const wrap=document.createElement('div');
        wrap.className=this.className;
        wrap.setAttribute('aria-hidden','true');
        wrap.innerHTML=this.template();
        document.body.append(wrap);
        this.node=wrap;
        this.afterMount();
        window.setTimeout(()=>wrap.classList.add('is-leaving'),this.leaveAt);
        window.setTimeout(()=>{wrap.remove();if(this.node===wrap)this.node=null;},this.removeAt);
      },this.delay);
    }
  }

  class PlayerPageAnimation extends BasePageAnimation {
    constructor(ctx){super({...ctx,page:'jugadores',className:'player-entrance',delay:160,leaveAt:1030,removeAt:1320});}
    template(){return `<div class="player-motion-stage">
      <div class="player-speed-line line-one"></div><div class="player-speed-line line-two"></div><div class="player-speed-line line-three"></div>
      <div class="player-runner"><i class="fa-solid fa-person-running"></i></div>
      <div class="player-ball"><i class="fa-solid fa-futbol"></i></div>
      <div class="player-star star-one"><i class="fa-solid fa-star"></i></div><div class="player-star star-two"><i class="fa-solid fa-star"></i></div><div class="player-star star-three"><i class="fa-solid fa-star"></i></div>
    </div>`;}
  }

  class TeamsPageAnimation extends BasePageAnimation {
    constructor(ctx){super({...ctx,page:'equipos',className:'teams-entrance',delay:160,leaveAt:1000,removeAt:1290});}
    template(){return `<div class="teams-motion-stage">
      <div class="team-shield team-shield-a"><i class="fa-solid fa-shield-halved"></i></div>
      <div class="team-shield team-shield-b"><i class="fa-solid fa-shield-halved"></i></div>
      <div class="team-shield team-shield-c"><i class="fa-solid fa-shield-halved"></i></div>
      <div class="team-spark team-spark-a"><i class="fa-solid fa-star"></i></div><div class="team-spark team-spark-b"><i class="fa-solid fa-star"></i></div>
    </div>`;}
  }

  class JornadaPageAnimation extends BasePageAnimation {
    constructor(ctx){super({...ctx,page:'jornadas',className:'jornada-entrance',delay:160,leaveAt:1030,removeAt:1320});}
    template(){return `<div class="jornada-motion-stage">
      <div class="calendar-card"><div class="calendar-rings"><span></span><span></span></div><div class="calendar-head"></div><div class="calendar-grid"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="calendar-page">J3</div></div>
      <div class="date-chip date-chip-one">03</div><div class="date-chip date-chip-two">10</div><div class="date-chip date-chip-three">17</div>
    </div>`;}
  }

  class MatchPageAnimation extends BasePageAnimation {
    constructor(ctx){super({...ctx,page:'partidos',className:'match-entrance',delay:150,leaveAt:1010,removeAt:1300});}
    template(){return `<div class="match-motion-stage">
      <div class="match-shield match-left"><i class="fa-solid fa-shield-halved"></i></div><div class="match-vs">VS</div><div class="match-shield match-right"><i class="fa-solid fa-shield-halved"></i></div>
      <div class="match-ball"><i class="fa-solid fa-futbol"></i></div><span class="impact-ring ring-one"></span><span class="impact-ring ring-two"></span>
    </div>`;}
  }

  class IncidentPageAnimation extends BasePageAnimation {
    constructor(ctx){super({...ctx,page:'incidencias',className:'incident-entrance',delay:150,leaveAt:1010,removeAt:1300});}
    template(){return `<div class="incident-motion-stage">
      <div class="ref-whistle"><i class="fa-solid fa-triangle-exclamation"></i></div>
      <div class="incident-card yellow-card"></div><div class="incident-card red-card"></div>
      <span class="incident-line line-a"></span><span class="incident-line line-b"></span><span class="incident-line line-c"></span>
    </div>`;}
  }

  class GoalPageAnimation extends BasePageAnimation {
    constructor(ctx){super({...ctx,page:'goles',className:'goal-overlay-demo',delay:180,leaveAt:1120,removeAt:1380});}
    template(){return `<div class="goal-swish-demo"></div><div class="flying-ball-demo"><i class="fa-solid fa-futbol"></i></div><div class="goal-title-demo">¡G O L!</div>`;}
    afterMount(){
      requestAnimationFrame(()=>this.node?.classList.add('active'));
      window.setTimeout(()=>{
        if(typeof window.confetti==='function'){
          window.confetti({particleCount:42,spread:72,startVelocity:24,gravity:.75,scalar:.8,origin:{x:.56,y:.55},colors:['#22c55e','#ffffff','#facc15','#3498db']});
        }else if(this.ui?.KawaiiMotion){
          this.ui.KawaiiMotion.burst(innerWidth*.56,innerHeight*.55);
        }
      },320);
    }
  }

  class PageAnimationFactory {
    constructor(context={}){
      this.context=context;
      this.registry=new Map([
        ['jugadores',PlayerPageAnimation],['equipos',TeamsPageAnimation],['jornadas',JornadaPageAnimation],
        ['partidos',MatchPageAnimation],['goles',GoalPageAnimation],['incidencias',IncidentPageAnimation]
      ]);
    }
    run(){
      const page=document.body.dataset.page;
      const AnimationClass=this.registry.get(page);
      if(!AnimationClass) return null;
      const animation=new AnimationClass(this.context);
      animation.play();
      return animation;
    }
  }

  window.TorneoAnimations={BasePageAnimation,PlayerPageAnimation,TeamsPageAnimation,JornadaPageAnimation,MatchPageAnimation,IncidentPageAnimation,GoalPageAnimation,PageAnimationFactory};
})();
