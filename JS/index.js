var app = new Vue({
	el: '#cuerpo',
	data: {
		todo: false,
		principal: true,
		categoria: false,
		carrito: false,
		opciones: [],
		inventarios: {},
		view_prods: "",
		carrito: {}
	},
	methods: {
		setInfo: function (objeto) {
			this.opciones = Object.keys(objeto);
			this.inventarios = objeto;
			for (var i = 0; i < this.opciones.length; i++) {
				for (var j = 0; j < this.inventarios[this.opciones[i]].length; j++) {
					var code = this.inventarios[this.opciones[i]][j]
					this.carrito[code.id] = 0;
				}
			}
			this.todo = true;
		},
		navOpt: function (opcion) {
			this.view_prods = opcion;
			this.principal = false;
			this.categoria = true;
		},
		negativo: function(id) {
			if (this.carrito[id] > 0) {
				this.carrito[id] -= 1;
			}
			this.$forceUpdate();
		},
		positivo: function(id) {
			this.carrito[id] += 1;
			this.$forceUpdate();
		}
	},
	computed: {
		prods() {
			return this.inventarios[this.view_prods];
		}
	},
	filters: {
		quetzales: function (number) {
			return 'Q ' + number.toFixed(2);
		}
	},
	created: function () {
		var self = this;
		$.ajax({
			url: 'https://script.google.com/macros/s/AKfycbzIpbFwTkuPjr3qTwbQhfPM3T39ymDoYLEXPFxGNSOhWix4nKE0/exec?option=getInv',
			method: 'GET',
			success: function (data) {
				var response = JSON.parse(data);
				self.setInfo(response);
			},
			error: function (error) {
				console.log(error)
			}
		});
	}
})