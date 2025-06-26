document.addEventListener('DOMContentLoaded', function() {
    // Máscara para telefone
    $('#tel').mask('(00) 00000-0000');
    
    // Toggle password visibility
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
                this.setAttribute('aria-label', 'Ocultar senha');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
                this.setAttribute('aria-label', 'Mostrar senha');
            }
        });
    });
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text span');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // Contains at least one lowercase letter
        if (password.match(/[a-z]/)) strength++;
        
        // Contains at least one uppercase letter
        if (password.match(/[A-Z]/)) strength++;
        
        // Contains at least one number
        if (password.match(/[0-9]/)) strength++;
        
        // Contains at least one special character
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        
        // Length is at least 8 characters
        if (password.length >= 8) strength++;
        
        // Update strength bar and text
        const width = (strength / 5) * 100;
        strengthBar.style.width = width + '%';
        
        if (strength <= 1) {
            strengthBar.style.backgroundColor = '#ff4d4d';
            strengthText.textContent = 'fraca';
        } else if (strength <= 3) {
            strengthBar.style.backgroundColor = '#ffa64d';
            strengthText.textContent = 'média';
        } else {
            strengthBar.style.backgroundColor = '#4CAF50';
            strengthText.textContent = 'forte';
        }
    });
    
    // Multi-step form navigation
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const nextStepNum = this.getAttribute('data-next');
            const nextStep = document.querySelector(`.form-step[data-step="${nextStepNum}"]`);
            
            // Validate current step before proceeding
            let isValid = true;
            const inputs = currentStep.querySelectorAll('input[required], select[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                }
            });
            
            // Special validation for password match
            if (currentStep.dataset.step === '1') {
                const password = document.getElementById('password').value;
                const confirm = document.getElementById('confirm').value;
                
                if (password !== confirm) {
                    document.getElementById('confirm').classList.add('error');
                    showNotification('As senhas não coincidem!', 'error');
                    isValid = false;
                }
            }
            
            if (!isValid) {
                showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
                return;
            }
            
            // Update progress steps
            progressSteps.forEach(step => {
                if (parseInt(step.dataset.step) <= parseInt(nextStepNum)) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
            
            // Switch to next step
            currentStep.classList.remove('active');
            nextStep.classList.add('active');
            
            // Smooth scroll to top of form
            document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
            
            // Fill summary in step 3
            if (nextStepNum === '3') {
                fillSummary();
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const prevStepNum = this.getAttribute('data-prev');
            const prevStep = document.querySelector(`.form-step[data-step="${prevStepNum}"]`);
            
            // Update progress steps
            progressSteps.forEach(step => {
                if (parseInt(step.dataset.step) <= parseInt(prevStepNum)) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
            
            // Switch to previous step
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
            
            // Smooth scroll to top of form
            document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Fill summary data
    function fillSummary() {
        document.getElementById('summary-name').textContent = document.getElementById('name').value;
        document.getElementById('summary-email').textContent = document.getElementById('email').value;
        document.getElementById('summary-tel').textContent = document.getElementById('tel').value;
        document.getElementById('summary-birthdate').textContent = formatDate(document.getElementById('birthdate').value);
        document.getElementById('summary-bloodType').textContent = document.getElementById('bloodType').value || 'Não informado';
        document.getElementById('summary-allergies').textContent = document.getElementById('allergies').value || 'Nenhuma alergia informada';
    }
    
    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return 'Não informada';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationText = notification.querySelector('.notification-text');
        
        notificationText.textContent = message;
        notification.className = `floating-notification ${type}`;
        notification.style.display = 'flex';
        
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 3000);
    }
    
    // Form submission
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Cadastro realizado com sucesso! Redirecionando...', 'success');
            
            // Reset form and go to step 1
            setTimeout(() => {
                this.reset();
                steps.forEach(step => step.classList.remove('active'));
                document.querySelector('.form-step[data-step="1"]').classList.add('active');
                progressSteps.forEach(step => {
                    if (step.dataset.step === '1') {
                        step.classList.add('active');
                    } else {
                        step.classList.remove('active');
                    }
                });
                
                // In a real app, you would redirect or do something else here
                // window.location.href = 'dashboard.html';
            }, 2000);
        }, 1000);
    });
    
    // Input focus effects
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('.input-highlight').classList.add('active');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.querySelector('.input-highlight').classList.remove('active');
        });
    });
});