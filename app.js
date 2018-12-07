$(() => {
    const INITIAL_MESSAGES_COUNT = 50
    const API_BASE_URL = window.API_BASE_URL

    const ui = {
        messages: $('#messages'),
        message: $('#message'),
        submit: $('#submit'),
        username: $('#username'),
    }
    let newestMessageId = null

    ui.username.val(getUsername())
    ui.username.on('change', () => {
        if (ui.username.val()) {
            sessionStorage.setItem('username', ui.username.val())
            ui.username.removeClass('is-invalid')
        } else {
            ui.username.addClass('is-invalid')
        }
    })
    ui.message.on('keyup', event => {
        if (ui.message.val()) {
            ui.message.removeClass('is-invalid')
        }
        if (event.keyCode === 13) {
            submitMessage()
        }
    })
    ui.submit.on('click', submitMessage)
    setInterval(updateMessages, 2000)
    updateMessages()

    async function updateMessages() {
        if (updateMessages.lock) {
            return
        }
        updateMessages.lock = true
        try {
            const messages = await fetchMessages()
            renderMessages(messages).appendTo(ui.messages)
        } finally {
            updateMessages.lock = false
        }
    }

    function renderMessages(messages) {
        return $(messages).map((_, message) => renderMessage(message))
    }

    function renderMessage(message) {
        return $('<div class="py-2">').append([
            $('<div class="pb-1 text-muted">').text(moment.unix(message.created_at).format('Do Mo HH:mm:ss')),
            $('<div class="d-flex">').append([
                $('<span class="font-weight-bold pr-4">').text(`${message.username}:`),
                $('<span class="flex-grow-1">').text(message),
            ]),
        ])
    }

    async function submitMessage() {
        if (!ui.message.val()) {
            ui.message.addClass('is-invalid')
        }
        if (!ui.username.val() || !ui.message.val()) {
            return
        }

        ui.message.add(ui.submit).attr('disabled', '')
        await sendMessage(ui.username.val(), ui.message.val())
        ui.message.val('')
        ui.message.add(ui.submit).removeAttr('disabled')
    }

    function getUsername() {
        const storedName = sessionStorage.getItem('username')
        if (storedName) {
            return storedName
        }

        const newUsername = generateUsername()
        sessionStorage.setItem('username', newUsername)
        return newUsername
    }

    function generateUsername() {
        const CHAINS = [
            'ay', 'ho', 'ri', 'tus', 'ga', 'ni', 'of', 'me', 'ar', 'gorn', 'vas', 'si'
        ]
        const chainCount = Math.floor(Math.random() * (5 - 2 + 1)) + 2
        const parts = []
        for (let i = 0; i < chainCount; i++) {
            parts.push(CHAINS[Math.floor(Math.random() * (CHAINS.length - 0 + 1)) + 0])
        }
        return parts.join('').charAt(0).toUpperCase() + parts.join('').substring(1)
    }

    async function fetchMessages() {
        const query = newestMessageId ?
            {
                after: newestMessageId,
            }
        :
            {
                latest: INITIAL_MESSAGES_COUNT,
            }
        const response = await fetch(`${API_BASE_URL}/messages`)
        if (!response.ok) {
            throw new Error(`The backend responded with status code ${response.status} ${response.statusText}`)
        }
        return response.json()
    }

    async function sendMessage(username, message) {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: {},
            body: JSON.stringify({
                username: username,
                message: message,
            }),
        })
        if (!response.ok) {
            throw new Error(`The backend responded with status code ${response.status} ${response.statusText}`)
        }
        return response.json()
    }
})
