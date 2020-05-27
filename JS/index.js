var app = new Vue({
	el: '#cuerpo',
	data: {
		todo: false,
		principal: true,
		categoria: false,
		contacto: false,
		cart: false,
		olvido: false,
		done: false,
		total: 0,
		opciones: [],
		inventarios: {},
		por_llaves: {},
		view_prods: "",
		user: {name: '', phone: '', city: '', addr: '', pay: '', trans: ''},
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
					this.por_llaves[code.id] = {name: code.name, price: code.price, unit: code.unit, metric: code.metric};
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
			this.contacto = false;
			this.cart = false;
			this.done = false;
			this.categoria = true;
		},
		feedback: function () {
			this.principal = false;
			this.categoria = false;
			this.cart = false;
			this.done = false;
			this.contacto = true;
		},
		negativo: function(id) {
			if (this.carrito[id] > 0) {
				this.carrito[id] -= this.por_llaves[id]["metric"];
			}
			this.$forceUpdate();
		},
		positivo: function(id) {
			this.carrito[id] += this.por_llaves[id]["metric"];
			this.$forceUpdate();
		},
		navSup: function () {
			this.contacto = false;
			this.cart = false;
			this.categoria = false;
			this.done = false;
			this.principal = true;
		},
		navCart: function () {
			var compras = this.checkout();
			this.total = 0;
			for (var t = 0; t < compras.length; t++) {
				this.total += this.por_llaves[compras[t].id].price * compras[t].ammo;
			}
			this.categoria = false;
			this.contacto = false;
			this.principal = false;
			this.done = false;
			this.cart = true;
		},
		postOrder: function () {
			var orden = JSON.stringify(this.checkout());
			if ((this.total == 0) || (orden.length == 0)) {
				alert('¿Por qué no has escogido nada?\nNo es posible colocar una orden vacía.')
			} else {
				if ((this.user.name == '') || (this.user.phone == '') || (this.user.city == '') || (this.user.addr == '') || (this.user.pay == '')) {
					this.olvido = true;
				} else {
					this.olvido = false;
					var seguro = confirm('Estás a punto de colocar to orden.\nSi ya revisaste todo, ¿deseas continuar?');
					if (seguro) {
						var self = this;
						var params = '';
						var ahora = new Date();
						var tiempo = ahora.getTime();
						params += '&stamp=' + tiempo;
						params += '&name=' + self.user.name;
						params += '&tel=' + self.user.phone;
						params += '&dir=' + self.user.addr + ' ' + self.user.city;
						params += '&pay=' + self.user.pay + ' ' + self.user.trans;
						params += '&orden=' + orden;
						$.ajax({
							url: 'https://script.google.com/macros/s/AKfycbzIpbFwTkuPjr3qTwbQhfPM3T39ymDoYLEXPFxGNSOhWix4nKE0/exec?option=placeOrd' + params,
							method: 'GET',
							success: function (data) {
								var response = JSON.parse(data);
								if (response.stamp == tiempo) {
									self.bien();
								} else {
									self.mal();
								}
							},
							error: function (error) {
								self.mal();
							}
						});
					}
				}
			}		
		},
		bien: function () {
			this.total = 0;
			this.user = {name: '', phone: '', city: '', addr: '', pay: '', trans: ''};
			var temp = Object.keys(this.carrito);
			for (var x = 0; x < temp.length; x++) {
				this.carrito[temp[x]] = 0;
			}
			this.categoria = false;
			this.principal = false;
			this.cart = false;
			this.done = true;
		},
		mal: function () {
			alert('¡Ha sucedido un error!\nLo sentimos, ¿puedes intentarlo otra vez, por favor?');
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