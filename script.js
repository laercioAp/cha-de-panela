document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    const successModal = document.getElementById('successModal');
    const closeModal = document.querySelector('.close');
    const rsvpForm = document.getElementById('rsvp-form');
    const submitButton = rsvpForm.querySelector('button[type="submit"]');

    // Inicialmente, o modal de sucesso está oculto
    successModal.style.display = 'none';

    // Inicialmente, o botão de submit está desabilitado
    submitButton.disabled = true;

    // Configuração da máscara de telefone/celular
    if (window.Inputmask) {
        Inputmask({"mask": ["(99) 9999-9999", "(99) 99999-9999"]}).mask(phoneInput);
    } else {
        console.error('Inputmask library not loaded.');
    }

    // Função para verificar se os campos obrigatórios estão preenchidos
    const checkFormValidity = () => {
        const nameInput = document.getElementById('name').value.trim();
        const phoneInputValue = phoneInput.value.trim();
        const attendanceInput = document.getElementById('attendance').value.trim();
        
        const isValid = nameInput && phoneInputValue && attendanceInput;

        submitButton.disabled = !isValid;
    };

    // Adiciona event listeners para os campos do formulário
    const formElements = rsvpForm.querySelectorAll('input, select');
    formElements.forEach(element => {
        element.addEventListener('input', checkFormValidity);
    });

    // Verificar a validade do formulário novamente após adicionar novos campos
    checkFormValidity();

    // Função de submit do formulário
    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('https://api.sheetmonkey.io/form/29ooQHCn7VpNYebL2diQfE', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();  // Lê a resposta como texto
        })
        .then(data => {
            // Exibe o modal de sucesso
            successModal.style.display = 'flex';  // Certifica-se de que o modal é exibido como flexbox
            // Limpa os campos do formulário
            rsvpForm.reset();
            submitButton.disabled = true;  // Desabilitar o botão após o reset
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    };

    rsvpForm.addEventListener('submit', handleSubmit);

    // Fechar o modal quando o usuário clicar no "X"
    closeModal.addEventListener('click', () => {
        successModal.style.display = 'none';
    });

    // Fechar o modal quando o usuário clicar fora do conteúdo do modal
    window.addEventListener('click', (event) => {
        if (event.target == successModal) {
            successModal.style.display = 'none';
        }
    });
});
