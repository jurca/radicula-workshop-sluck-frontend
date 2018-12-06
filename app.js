$(() => {
    const ui = {
        messages: $('#messages'),
        message: $('#message'),
        submit: $('#submit'),
    }
    let newestMessageId = null

    function renderMessage(message) {
        return $('<div class="py-2">').append([
            $('<div class="pb-1 text-muted">').text(message.create_at), // unix timestamp, format using moment.js
            $('<div class="d-flex">').append([
                $('<span class="font-weight-bold pr-4">').text(`${message.user_id}:`),
                $('<span class="flex-grow-1">').text(message),
            ]),
        ])
    }

    async function sendMessage() {
        ui.message.add(ui.submit).attr('disabled', '')
        // TODO
        ui.message.add(ui.submit).removeAttr('disabled')
    }
})
