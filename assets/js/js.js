class Calculadora {
    constructor() {
        this.valorActual = '0';
        this.valorAnterior = '';
        this.operacion = null;
        this.esperandoNuevoNumero = false;
        this.memoria = 0;
    }

    // Método para limpiar todo
    limpiarTodo() {
        this.valorActual = '0';
        this.valorAnterior = '';
        this.operacion = null;
        this.esperandoNuevoNumero = false;
    }

    // Método para cambiar el signo
    cambiarSigno() {
        if (this.valorActual === '0') return;
        this.valorActual = (parseFloat(this.valorActual) * -1).toString();
    }

    // Método para calcular porcentaje
    porcentaje() {
        if (this.valorActual === '0') return;
        this.valorActual = (parseFloat(this.valorActual) / 100).toString();
    }

    // Método para agregar un número
    agregarNumero(numero) {
        if (numero === '.' && this.valorActual.includes('.')) {
            return;
        }

        if (this.esperandoNuevoNumero) {
            this.valorActual = numero;
            this.esperandoNuevoNumero = false;
        } else {
            if (this.valorActual === '0' && numero !== '.') {
                this.valorActual = numero;
            } else {
                this.valorActual += numero;
            }
        }
    }

    // Método para seleccionar operación
    seleccionarOperacion(op) {
        if (this.valorActual === '') return;

        if (this.valorAnterior !== '') {
            this.calcular();
        }

        this.operacion = op;
        this.valorAnterior = this.valorActual;
        this.esperandoNuevoNumero = true;
    }

    // Método para realizar el cálculo
    calcular() {
        let resultado;
        const anterior = parseFloat(this.valorAnterior);
        const actual = parseFloat(this.valorActual);

        if (isNaN(anterior) || isNaN(actual)) return;

        switch (this.operacion) {
            case '+':
                resultado = anterior + actual;
                break;
            case '-':
                resultado = anterior - actual;
                break;
            case 'X':
                resultado = anterior * actual;
                break;
            case '÷':
                if (actual === 0) {
                    resultado = 'Error';
                } else {
                    resultado = anterior / actual;
                }
                break;
            default:
                return;
        }

        // Redondear para evitar problemas de precisión
        if (typeof resultado === 'number') {
            resultado = Math.round(resultado * 1000000000000) / 1000000000000;
        }
        
        this.valorActual = resultado.toString();
        this.operacion = null;
        this.valorAnterior = '';
        this.esperandoNuevoNumero = true;
    }

    // Método para calcular cuadrado (X²)
    cuadrado() {
        if (this.valorActual === '0') return;
        const numero = parseFloat(this.valorActual);
        this.valorActual = (numero * numero).toString();
        this.esperandoNuevoNumero = true;
    }

    // Método para calcular cubo (X³)
    cubo() {
        if (this.valorActual === '0') return;
        const numero = parseFloat(this.valorActual);
        this.valorActual = (numero * numero * numero).toString();
        this.esperandoNuevoNumero = true;
    }

    // Método para insertar PI
    insertarPI() {
        this.valorActual = Math.PI.toString();
        this.esperandoNuevoNumero = true;
    }

    // Método para calcular raíz cuadrada (√)
    raizCuadrada() {
        if (this.valorActual === '0') return;
        const numero = parseFloat(this.valorActual);
        if (numero < 0) {
            this.valorActual = 'Error';
        } else {
            this.valorActual = Math.sqrt(numero).toString();
        }
        this.esperandoNuevoNumero = true;
    }

    // Método para obtener el valor actual
    obtenerValorActual() {
        if (this.valorActual.length > 12) {
            return parseFloat(this.valorActual).toExponential(6);
        }
        return this.valorActual;
    }
}

// Clase para manejar la interfaz de usuario
class InterfazCalculadora {
    constructor(calculadora) {
        this.calculadora = calculadora;
        this.pantalla = document.querySelector('.inputStyle');
        this.inicializarEventos();
        this.actualizarPantalla();
    }

    inicializarEventos() {
        // Obtener todos los botones
        const botones = document.querySelectorAll('button');
        
        botones.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const textoBoton = boton.textContent;
                this.manejarEntrada(textoBoton);
            });
        });

        // Manejar entrada por teclado
        document.addEventListener('keydown', (e) => {
            this.manejarTeclado(e);
        });
    }

    manejarEntrada(valor) {
        // Mapear los símbolos especiales
        const mapaOperadores = {
            '÷': '/',
            'X': '*',
            '−': '-',
            '+': '+',
            '=': 'Enter'
        };

        switch (valor) {
            case 'AC':
                this.calculadora.limpiarTodo();
                break;
            case '+/-':
                this.calculadora.cambiarSigno();
                break;
            case '%':
                this.calculadora.porcentaje();
                break;
            case '÷':
            case 'X':
            case '-':
            case '+':
                const operador = valor === 'X' ? 'X' : (valor === '÷' ? '÷' : valor);
                this.calculadora.seleccionarOperacion(operador);
                break;
            case '=':
                this.calculadora.calcular();
                break;
            case 'X²':
                this.calculadora.cuadrado();
                break;
            case 'X³':
                this.calculadora.cubo();
                break;
            case 'PI':
                this.calculadora.insertarPI();
                break;
            case '√':
                this.calculadora.raizCuadrada();
                break;
            default:
                // Para números y punto decimal
                if (!isNaN(valor) || valor === '.') {
                    this.calculadora.agregarNumero(valor);
                }
        }
        
        this.actualizarPantalla();
    }

    manejarTeclado(e) {
        const tecla = e.key;
        
        // Prevenir comportamiento por defecto para algunas teclas
        if (tecla === '/' || tecla === '*' || tecla === 'Enter') {
            e.preventDefault();
        }

        // Mapear teclas a operaciones
        switch (tecla) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '.':
                this.manejarEntrada(tecla);
                break;
            case '+':
            case '-':
                this.manejarEntrada(tecla);
                break;
            case '*':
                this.manejarEntrada('X');
                break;
            case '/':
                this.manejarEntrada('÷');
                break;
            case 'Enter':
            case '=':
                this.manejarEntrada('=');
                break;
            case 'Escape':
                this.manejarEntrada('AC');
                break;
            case '%':
                this.manejarEntrada('%');
                break;
            case 'Backspace':
                // Funcionalidad adicional: borrar último dígito
                this.calculadora.valorActual = this.calculadora.valorActual.slice(0, -1) || '0';
                this.actualizarPantalla();
                break;
            case 's':
            case 'S':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                }
                break;
        }
    }

    actualizarPantalla() {
        let valorAMostrar = this.calculadora.obtenerValorActual();
        
        // Formatear números muy grandes o muy pequeños
        if (valorAMostrar.includes('e') || valorAMostrar.includes('E')) {
            this.pantalla.style.fontSize = '35px';
        } else if (valorAMostrar.length > 10) {
            this.pantalla.style.fontSize = '35px';
        } else {
            this.pantalla.style.fontSize = '50px';
        }
        
        this.pantalla.value = valorAMostrar;
    }
}

// Inicializar la calculadora cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const calculadora = new Calculadora();
    const interfaz = new InterfazCalculadora(calculadora);
    
    // Establecer valor inicial
    document.querySelector('.inputStyle').value = '0';
});