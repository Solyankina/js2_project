Vue.component('catalog', {
    template: `<section class="catalog center">
        <div class="catalog__text">
            <h2 class="catalog__h2">Featured Items</h2>
            <p class="catalog__p">Shop for items based on what we featured in this week</p>
        </div>
        <products></products>
        <div class="catalog__button">
            <button class="line__button">Browse All Product</button>
        </div>
    </section>`
});

Vue.component('products', {
    data() {
        return {
            products: [],
            filtered: []
        }
    },
    mounted() {
        this.$root.getJson('/api/products').then(data => {
            this.products = data;
            this.filtered = this.products;
        });
        const search = this.$root.$refs.search;
        search.$on('search', () => this.filtered = search.filter(this.products, (p) => p.title));
    },
    props: ['search'],
    template: `
        <div class="catalog__item__container">
            <product v-for="item of filtered" :key="item.id" :product="item"></product>
        </div>`
});

Vue.component('product', {
    props: ['product'],
    methods: {
        addToCart() {
            this.$root.putJson(`/api/cart/${this.product.id}`, {quantity: 1})
        }
    },
    template: `<div class="catalog__item">
                <figure class="img__catalog__item">
                    <a :href="'product/' + product.id">
                        <img :src="product.img" alt="item">
                    </a>
                    <figcaption class="container__text">
                        <a :href="'product/' + product.id" class="catalog__header">{{product.title}}</a>
                        <p class="catalog__p">{{product.text}}</p>
                        <span class="catalog__span">\${{product.price}}</span>
                    </figcaption>
                </figure>
                <div class="catalog__item__hover">
                    <button class="cart__button" @click="addToCart()">
                        <img class="icon__cart" src="img/icon-cart.svg" alt="icon">
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
`
});