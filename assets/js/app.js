
class ToastManager {
  constructor() {
    this.el = document.querySelector('[data-toast]');
    this.timer = null;
  }
  show(message) {
    if (!this.el) return;
    this.el.textContent = message;
    this.el.classList.add('show');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.el.classList.remove('show'), 2600);
  }
}

class ConfirmationDialog {
  constructor() {
    this.pending = null;
    this.build();
  }
  build() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'confirm-backdrop';
    this.backdrop.innerHTML = `
      <section class="confirm-card" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div class="confirm-icon"><i class="fa-solid fa-shield-check"></i></div>
        <h3 id="confirm-title">Revisar antes de guardar</h3>
        <p data-confirm-message>Así se guardará la información. Revísala antes de continuar.</p>
        <dl class="confirm-summary" data-confirm-summary></dl>
        <div class="confirm-actions">
          <button type="button" class="btn btn-outline" data-confirm-back><i class="fa-solid fa-arrow-left"></i>Regresar</button>
          <button type="button" class="btn confirm-save" data-confirm-ok><i class="fa-solid fa-check"></i><span>Guardar</span></button>
        </div>
      </section>`;
    document.body.appendChild(this.backdrop);
    this.card = this.backdrop.querySelector('.confirm-card');
    this.title = this.backdrop.querySelector('h3');
    this.message = this.backdrop.querySelector('[data-confirm-message]');
    this.summary = this.backdrop.querySelector('[data-confirm-summary]');
    this.ok = this.backdrop.querySelector('[data-confirm-ok]');
    this.okText = this.ok.querySelector('span');
    this.backdrop.querySelector('[data-confirm-back]').addEventListener('click', () => this.close());
    this.ok.addEventListener('click', () => this.confirm());
    this.backdrop.addEventListener('click', e => { if (e.target === this.backdrop) this.close(); });
  }
  open({title='Confirmar acción', message='¿Deseas continuar?', rows=[], confirmText='Confirmar', danger=false, onConfirm=null}) {
    this.pending = onConfirm;
    this.title.textContent = title;
    this.message.textContent = message;
    this.okText.textContent = confirmText;
    this.card.classList.toggle('danger', danger);
    this.ok.querySelector('i').className = danger ? 'fa-solid fa-trash' : 'fa-solid fa-check';
    this.summary.innerHTML = '';
    rows.forEach(({label,value}) => {
      const row = document.createElement('div');
      row.className = 'confirm-row';
      row.innerHTML = `<dt></dt><dd></dd>`;
      row.querySelector('dt').textContent = label;
      row.querySelector('dd').textContent = value || '—';
      this.summary.appendChild(row);
    });
    this.summary.style.display = rows.length ? 'grid' : 'none';
    this.backdrop.classList.add('show');
    document.body.classList.add('modal-open');
  }
  close() {
    this.backdrop.classList.remove('show');
    document.body.classList.toggle('modal-open', !!document.querySelector('.crud-backdrop.show'));
    this.pending = null;
  }
  confirm() {
    const callback = this.pending;
    this.close();
    if (callback) callback();
  }
}

class SidebarController {
  constructor() {
    this.sidebar = document.querySelector('.sidebar');
    this.backdrop = document.querySelector('[data-mobile-backdrop]');
    document.querySelector('[data-menu-toggle]')?.addEventListener('click', () => this.toggle());
    this.backdrop?.addEventListener('click', () => this.close());
  }
  toggle() { this.sidebar?.classList.toggle('open'); this.backdrop?.classList.toggle('show'); }
  close() { this.sidebar?.classList.remove('open'); this.backdrop?.classList.remove('show'); }
}

class SearchController {
  constructor() {
    document.querySelectorAll('[data-search-input]').forEach(input => input.addEventListener('input', () => this.filter(input)));
    document.querySelectorAll('[data-filter-select]').forEach(select => select.addEventListener('change', () => this.filter(select)));
  }
  filter(control) {
    const scope = control.closest('[data-filter-scope]') || document;
    const q = (scope.querySelector('[data-search-input]')?.value || '').toLowerCase().trim();
    const selected = [...scope.querySelectorAll('[data-filter-select]')].map(s => ({ key: s.dataset.filterSelect, value: s.value.toLowerCase() }));
    scope.querySelectorAll('[data-filter-item]').forEach(item => {
      const text = (item.dataset.search || item.textContent).toLowerCase();
      let ok = !q || text.includes(q);
      for (const f of selected) {
        if (f.value && f.value !== 'todos' && (item.dataset[f.key] || '').toLowerCase() !== f.value) ok = false;
      }
      item.style.display = ok ? '' : 'none';
    });
  }
}

class FormSummaryBuilder {
  static fieldValue(field) {
    if (field.type === 'file') return field.files?.[0]?.name || 'Conservar fotografía actual / sin archivo seleccionado';
    if (field.type === 'radio') {
      if (!field.checked) return null;
      return field.dataset.summaryValue || field.value;
    }
    if (field.tagName === 'SELECT') return field.selectedOptions?.[0]?.textContent?.trim() || '';
    return field.value?.trim?.() ?? field.value;
  }
  static build(form) {
    const rows = [];
    const seenRadioNames = new Set();
    form.querySelectorAll('[data-summary-label]').forEach(field => {
      if (field.closest('[hidden]')) return;
      if (field.type === 'radio') {
        if (seenRadioNames.has(field.name)) return;
        seenRadioNames.add(field.name);
        const checked = form.querySelector(`input[type="radio"][name="${CSS.escape(field.name)}"]:checked`);
        if (!checked) return;
        rows.push({label: field.dataset.summaryLabel, value: FormSummaryBuilder.fieldValue(checked)});
        return;
      }
      rows.push({label: field.dataset.summaryLabel, value: FormSummaryBuilder.fieldValue(field)});
    });
    return rows;
  }
}

class CrudModalController {
  constructor(dialog, toast) {
    this.dialog = dialog;
    this.toast = toast;
    this.modals = new Map();
    document.querySelectorAll('[data-crud-modal]').forEach(el => this.register(el));
    document.addEventListener('click', e => {
      const open = e.target.closest('[data-crud-open]');
      if (open) { e.preventDefault(); this.open(open.dataset.crudOpen, open); return; }
      const close = e.target.closest('[data-close-crud]');
      if (close) { e.preventDefault(); this.close(close.closest('[data-crud-modal]')); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this.closeTop(); });
  }
  register(modal) {
    const name = modal.dataset.crudModal;
    this.modals.set(name, modal);
    modal.addEventListener('click', e => { if (e.target === modal) this.close(modal); });
    const form = modal.querySelector('[data-crud-form]');
    form?.addEventListener('submit', e => this.review(e, modal));
    if (name === 'incidencia') this.bindIncidence(modal);
  }
  open(name, trigger) {
    const modal = this.modals.get(name);
    if (!modal) return;
    const form = modal.querySelector('form');
    form.reset();
    this.clearErrors(form);
    const mode = trigger.dataset.mode || 'create';
    form.dataset.mode = mode;
    modal.querySelectorAll('[data-crud-title]').forEach(title => {
      title.textContent = mode === 'edit' ? title.dataset.editTitle : title.dataset.createTitle;
    });
    [...trigger.attributes].forEach(attr => {
      if (!attr.name.startsWith('data-')) return;
      const fieldName = attr.name.slice(5).replace(/-/g, '_');
      const field = form.elements.namedItem(fieldName);
      if (!field) return;
      if (field instanceof RadioNodeList) {
        [...field].forEach(r => r.checked = r.value === attr.value);
      } else if (field.type === 'radio') {
        form.querySelectorAll(`[name="${CSS.escape(field.name)}"]`).forEach(r => r.checked = r.value === attr.value);
      } else if (field.type !== 'file') field.value = attr.value;
    });
    if (name === 'incidencia') this.syncIncidence(modal);
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    setTimeout(() => modal.querySelector('input:not([type="radio"]), select, textarea')?.focus(), 40);
  }
  close(modal) {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.toggle('modal-open', !!document.querySelector('.crud-backdrop.show'));
  }
  closeTop() { const open = [...document.querySelectorAll('.crud-backdrop.show')].pop(); if (open) this.close(open); }
  review(event, modal) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!this.validate(form)) return;
    if (form.dataset.crudForm === 'partido') {
      const local = form.elements.local?.value;
      const visitante = form.elements.visitante?.value;
      if (local && visitante && local === visitante) {
        this.markError(form.elements.visitante, 'El equipo visitante debe ser diferente al local.');
        return;
      }
    }
    const mode = form.dataset.mode || 'create';
    const entity = form.dataset.entityLabel || 'Registro';
    const rows = FormSummaryBuilder.build(form);
    this.dialog.open({
      title: 'Revisar antes de guardar',
      message: `Así se ${mode === 'edit' ? 'actualizará' : 'guardará'} ${entity.toLowerCase()}. Verifica la información antes de confirmar.`,
      rows,
      confirmText: mode === 'edit' ? 'Guardar cambios' : 'Guardar',
      onConfirm: () => {
        this.close(modal);
        this.toast.show(`${entity} ${mode === 'edit' ? 'actualizado' : 'guardado'} en el prototipo.`);
      }
    });
  }
  validate(form) {
    this.clearErrors(form);
    let ok = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value || (field.type === 'number' && Number(field.value) < Number(field.min || 0))) {
        this.markError(field, 'Complete este campo antes de continuar.'); ok = false;
      }
    });
    if (form.dataset.crudForm === 'incidencia') {
      const red = form.querySelector('input[name="tarjeta"]:checked')?.value === 'ROJA';
      const suspension = form.elements.suspension;
      if (red && !suspension.value) { this.markError(suspension, 'La fecha de suspensión es obligatoria para tarjeta roja.'); ok = false; }
    }
    if (!ok) form.querySelector('.has-error input,.has-error select,.has-error textarea')?.focus();
    return ok;
  }
  markError(field, message) {
    const group = field.closest('.form-group'); if (!group) return;
    group.classList.add('has-error');
    let msg = group.querySelector('.validation-error');
    if (!msg) { msg = document.createElement('span'); msg.className='validation-error'; group.appendChild(msg); }
    msg.textContent = message;
  }
  clearErrors(form) { form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error')); form.querySelectorAll('.validation-error').forEach(e => e.remove()); }
  bindIncidence(modal) {
    modal.querySelectorAll('input[name="tarjeta"]').forEach(r => r.addEventListener('change', () => this.syncIncidence(modal)));
  }
  syncIncidence(modal) {
    const red = modal.querySelector('input[name="tarjeta"]:checked')?.value === 'ROJA';
    const field = modal.querySelector('[data-suspension-field]');
    const input = field?.querySelector('input');
    if (!field || !input) return;
    field.hidden = !red;
    input.required = red;
    if (!red) input.value='';
  }
}

class TournamentApp {
  constructor() {
    this.toast = new ToastManager();
    this.dialog = new ConfirmationDialog();
    new SidebarController();
    new SearchController();
    this.crud = new CrudModalController(this.dialog, this.toast);
    this.setActiveNav();
    this.bindActions();
  }
  setActiveNav() {
    const page = document.body.dataset.page;
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === page));
  }
  bindActions() {
    document.addEventListener('click', e => {
      const deleteBtn = e.target.closest('[data-confirm]');
      if (deleteBtn) {
        e.preventDefault();
        this.dialog.open({
          title:'Confirmar eliminación',
          message: deleteBtn.dataset.confirm || 'Esta acción eliminaría el registro. ¿Deseas continuar?',
          rows:[{label:'Acción',value:'Eliminar registro'}],
          confirmText:'Eliminar', danger:true,
          onConfirm:()=>this.toast.show('Eliminación simulada en el prototipo. La decisión final quedará para el equipo.')
        });
        return;
      }
      const toastBtn = e.target.closest('[data-toast-message]');
      if (toastBtn) { e.preventDefault(); this.toast.show(toastBtn.dataset.toastMessage); }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new TournamentApp());
