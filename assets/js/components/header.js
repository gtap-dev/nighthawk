'use strict';

const storage    = require('../storage');

$('#copyPreferenceForm').find('[name=copyPreferenceRadio]').each(function () {
    const $this = $(this);

    if ($this.val() === storage.get('iconPath')) {
        $this.prop('checked', true);
    } else {
        if ($this.val() === '/assets/svg/icons.svg#') {
            $this.prop('checked', true);
        }
    }
});

$('[data-action="toggle-settings"]').on('click', function () {
    const $this = $(this);
    const $dropdown = $this.parent();

    if ($dropdown.hasClass('is-open')) {
        $dropdown.removeClass('is-open');
    } else {
        $dropdown.addClass('is-open');
    }
});

$('#copyPreferenceSubmit').on('click', function () {
    const $this = $(this);

    storage.set('iconPath', $('[name=copyPreferenceRadio]:checked').val());

    if (storage.get('iconPath')) {
        $this.addClass('btn--order');
        $this.text('Saved!');
        $this.blur();
        window.setTimeout(function() {
            $this.removeClass('btn--order');
            $this.text('Save');
        }, 2000);
    } else {
        $this.addClass('btn--quit');
        $this.text('Error!');
        $this.blur();
        window.setTimeout(function() {
            $this.removeClass('btn--quit');
            $this.text('Save');
        }, 3000);
    }
});
