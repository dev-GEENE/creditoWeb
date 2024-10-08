document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form'); // Selecciona el formulario

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir la acción por defecto del formulario

        // Obtener los valores de los campos del formulario
        const nombre = document.getElementById('name').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('phone').value;
        const fechaDeNacimiento = document.getElementById('fecha_nacimiento').value;
        const dni = document.getElementById('dni').value;
        const autorizacion = document.getElementById('terms').checked;

        // Formatear la fecha de nacimiento a DD/MM/AÑo
        const fechaParts = fechaDeNacimiento.split('-');
        const fechaFormateada =  `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`;

        const nombreCompleto = `${nombre} ${apellido}`;

        // Crear un objeto JSON
        const datosFormulario = {
            "nombrecompleto": nombreCompleto,
            "Email": email,
            "Telefono": telefono,
            "FechaDeNacimiento": fechaFormateada,
            "NroDoc": dni,
            "Autorizacion": autorizacion
        };

        // Enviar los datos al servidor usando fetch con el header de JSON
        fetch('https://prod-28.brazilsouth.logic.azure.com:443/workflows/ec0be2cecb414940a85232b3f08a2a75/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RIoZYN2iAZ0haEBpZIM10oxxb7fsdJjDh5R-sNh2azc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Establecer el header de JSON
            },
            body: JSON.stringify(datosFormulario) // Convertir a JSON
        })
        .then(response => {
            console.log('Status Code:', response.status); 
            if (!response.ok) {
                return response.text().then(text => { 
                    throw new Error(`Error en el envío: ${response.status} - ${text}`);
                });
            }
            return response.text(); 
        })
        .then(text => {
            console.log('Raw Response:', text); 
            //alert('Formulario enviado con éxito');
            window.location.href = "https://agradecimientosc.geene.com.py/";
            form.reset();
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            alert('Hubo un error al enviar el formulario');
        });
    });

    document.getElementById('phone').addEventListener('input', function(e) {
        let input = e.target.value;

        // Si el primer carácter no es '+', agregarlo.
        if (!input.startsWith('+')) {
            e.target.value = '+'; // Establecer el símbolo +
            return; // Salir para evitar el formato incorrecto
        }

        // Solo permitir números después del '+'
        const formattedInput = input.replace(/[^+\d]/g, ''); // Permitir solo números y el símbolo '+'
        e.target.value = formattedInput; // Actualizar el input
    });
});
