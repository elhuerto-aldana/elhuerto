var app = new Vue({
	el: '#cuerpo',
	data: {
		todo: false,
		principal: true,
		categoria: false,
		cart: false,
		total: 0,
		opciones: [],
		inventarios: {},
		por_llaves: {},
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
					this.por_llaves[code.id] = {name: code.name, price: code.price, unit: code.unit};
				}
			}
			this.todo = true;
		},
		checkout: function () {
			var llaves = Object.keys(this.carrito);
			var validos = [];
			for (var l = 0; l < llaves.length; l++) {
				if (this.carrito[llaves[l]] != 0) {
					validos.push({id: llaves[l], ammo: this.carrito[llaves[l]]});
				}
			}
			return validos;
		},
		navOpt: function (opcion) {
			this.view_prods = opcion;
			this.principal = false;
			this.cart = false;
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
		},
		navSup: function () {
			this.cart = false;
			this.categoria = false;
			this.principal = true;
		},
		navCart: function () {
			var compras = this.checkout();
			this.total = 0;
			for (var t = 0; t < compras.length; t++) {
				this.total += this.por_llaves[compras[t].id].price * compras[t].ammo;
			}
			this.categoria = false;
			this.principal = false;
			this.cart = true;
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