document.addEventListener('DOMContentLoaded',()=>{
  const U=window.TorneoUI;
  const toast=new U.ToastComponent();
  const review=new U.ReviewDialog(toast);

  new U.MobileSidebar();
  new U.NavigationState();
  document.querySelectorAll('[data-counter]').forEach(e=>new U.AnimatedCounter(e));
  document.querySelectorAll('[data-global-search]').forEach(e=>new U.GlobalSearchComponent(e));
  document.querySelectorAll('[data-filter-scope]').forEach(s=>new U.FilterComponent(s));
  document.querySelectorAll('[data-filter-chips]').forEach(s=>new U.FilterChipComponent(s));
  document.querySelectorAll('.file-input').forEach(i=>new U.FileUploadComponent(i));
  document.querySelectorAll('[data-stepper]').forEach(i=>new U.GoalStepper(i));
  document.querySelectorAll('[data-disclosure]').forEach(b=>new U.DisclosureComponent(b));
  new U.TeamRosterDrawer();
  new U.ParticipantPickerComponent(toast);
  document.querySelectorAll('[data-coach]').forEach(e=>new U.CoachComponent(e));
  document.querySelectorAll('[data-crud-modal]').forEach(m=>new U.CrudModalComponent(m,review,toast));
  new U.ConfirmActions(review,toast);
  new U.SoccerCursorComponent();
  document.querySelectorAll('.module-card').forEach(el=>new U.ModuleCardTiltComponent(el));

  if(window.TorneoAnimations){
    new window.TorneoAnimations.PageAnimationFactory({toast,ui:U}).run();
  }

  document.querySelectorAll('.btn-primary,.module-card,.report-card').forEach(el=>
    el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')U.KawaiiMotion.burst(e.clientX,e.clientY)})
  );
});
