Vue.component('small-cart', {

    data(){
        return {
            items: [],
            message: "",
            showCart: false
        }
    },
    methods: {
        render() {
            this.$parent.getJson('/api/cart').then(data => {
                this.items = data;
                this.message = data.length > 0 ? "" : "Корзина пуста"
                this.showCart = true;
            });
        },
        hide() {
            this.showCart = false
        }
    },
    template: `
    <div class="small__cart" v-show="showCart">
        {{message}}<img class="icon__close" src="img/icon-close.svg" alt="close" @click="hide()">
        <small-cart-item v-for="item of items" :key="item.id" :item="item"></small-cart-item>
    </div>`
});

Vue.component('small-cart-item', {
    props: ['item'],
    methods: {
        decQuantity() {
            this.$root.putJson(`/api/cart/${this.item.id}`, {quantity: -1}).then(data => {
                this.items = data;
                this.$parent.render()
            });
        },

        incQuantity() {
            this.$root.putJson(`/api/cart/${this.item.id}`, {quantity: 1}).then(data => {
                this.items = data;
                this.$parent.render()
            });
        }
    },
    template: `
    <div class="small__cart__item">
        <div class="small__cart__item__title">{{item.title}}</div>
        <div class="small__cart__item__quantity">{{item.quantity}}
            <button v-if="item.quantity > 0" class="quantity__button" @click="decQuantity()"> - </button>
            <button class="quantity__button" @click="incQuantity()"> + </button>
        </div>
    </div>`
});
