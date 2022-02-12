# Fremwok-Fremwokan

Framework frontend Javascript yg dibuat untuk **belajar** lebih memahami tentang
**sistem reactivity** pada framework2 frontend modern. jika dilihat2
framework ini kayak gabungan Vue (yg versi 2) & React. Tapi untuk pembetukan
reactivity-nya sendiri disini saya pakai dasar dari konsep reactivity Vue.

Kalo tertarik mempelajari sendiri bagaimana dasar reactivity dari Vue,
silakan lihat beberapa resource ini:
1. **[Dokumentasi Vue tentang reactivity](https://vuejs.org/v2/guide/reactivity.html)**
2. **[Course reactivity dari Vue Mastery](https://www.vuemastery.com/courses/advanced-components/build-a-reactivity-system)**
kalo pengen gratis tunggu free akses dari Vue Mastery, kadang ada beberapa bulan sekali.
3. **[Artikel tentang reactivity dari teman](https://jefrydco.id/blog/create-reactivity-system-vuejs-javascript-part-1/)**

Selain itu ada juga **[Frontend Framework buatan sendiri](https://mfrachet.github.io/create-frontend-framework/)**
lainnya yg menginspirasi saya membuat Fremwok-Fremwokan.

> DISCLAIMER: Saya nggak memikirkan performa ataupun error handling, karena memang
> saya buat sesimpel mungkin untuk saya belajar lebih memahami tentang sistem reactivity,
> jadi jangan dipake buat build projek beneran.

## Contoh

Contoh pemakaian Fremwok-Fremwokan ada di folder **[example](./example)**. Dengan cara running:

```bash
$ yarn install
# atau
$ npm install
#
#
$ yarn example:dev
# atau
$ npm start example:dev
```

## Cara Pakai

Susunan komponen:
```js
import Fw from '../src/Fw';

const MyComponent = Fw.createComponent({
  name: 'MyComponent',
  props: {
    price: 0,
  },
  data: {
    quantity: 20,
    showTotal: false,
  },
  computed: {
    total () {
      return this.props.price * this.data.quantity;
    },
  },
  methods: {
    toggleTotal () {
      this.data.showTotal = !this.data.showTotal;
    },
  },
  created () {
    console.info('component created');
  },
  updated () {
    console.info('component updated');
  },
  destroyed () {
    console.info('component destroyed');
  },
  render () {
    return (
      <div>
        <p>
          Item Price = {this.props.price}
        </p>
        <p>
          Item QTY = {this.data.quantity}
        </p>
        <button on={{ click: this.methods.toggleTotal }}>
          Toggle Total
        </button>
        <p style={{ display: this.data.showTotal ? 'block' : 'none' }}>
          {this.computed.total}
        </p>
      </div>
    );
  },
});

const rootComponent = {
  render () {
    return (
      <div>
        <MyComponent price={10} />
      </div>
    );
  },
};

new Fw(rootComponent, document.body, {
  logger: [],
});
```

Bisa dilihat dari contoh penggunaan sederhananya kalau 1 komponen **bisa** terdiri dari `name`, `props`, `data`,
`computed`, `methods`, `created`, `updated`, `destroyed`, dan `render`, mirip Vue yg versi 2 kan.
Dan sama seperti Vue juga kalau nggak perlu semua penyusun komponennya dipakai, jadi misal nggak perlu
method atau computed ya gpp, hanya saja disini untuk `name` saya buat required karena digunakan menjadi
semacam ID dari komponen. Untuk penggunaan yang lebih lengkap bisa dilihat pada contoh di folder 
**[example](./example)**.

### Application Instance
1 instance aplikasi dari Fremwok-Fremwokan dibentuk dari pembuatan instance dari class Fw.
Argumennya komponen root, elemen untuk tempat aplikasinya di render contohnya `document.body` (tag `<body>`),
dan config lain yang sekarang cuma masih ada logger aja (nanti tak jelasin).

```js
new Fw(rootComponent, document.body, {
  logger: [],
});
```

### Component Instance
Bedanya apa sih **component instance** sama **application instance**? pada dasarnya application instance
itu dipake sebagai dasar nampung semua komponen yg bakal dibuat dan tidak bisa dipake jadi tag jsx,
jadi misal saya panggil root componentnya di jsx pake `<RootComponent />` nanti nggak bisa. Jadi root
component nggak bisa dipake lagi di tempat lain (nggak reusable).

Nah untuk **component instance** digunakan untuk deklarasi component yg reusable, jadi bisa dipanggil
di component lain menggunakan bentuk tag jsx nya, contohnya component `MyComponent`
dari susunan komponen di atas sendiri:

```js
import Fw from '../src/Fw';

const MyComponent = Fw.createComponent({
  // susunan komponennya
});

const rootComponent = {
  render () {
    return (
      <div>
        <MyComponent />
      </div>
    );
  },
};
```
### Data
Data disini adalah internal state dari component. Deklarasinya berbentuk `stateName`: `initial value`,
dan pemanggilannya `this.data.stateName`. Contohnya:

```js
...
data: {
  quantity: 20,
  showTotal: false,
},
...
computed: {
  total () {
    return this.props.price * this.data.quantity;
  },
},
...
```

Baca tentang **data dan reactivity** lebih lanjut [di sini](./docs/state.md).

### Computed
Computed atau kalau di React itu yang pakai `useMemo` adalah fungsi2 tanpa argumen yang
harus memberikan return value. Deklarasinya berbentuk fungsi dengan return value.
Pemanggilannya dengan `this.computed.namaComputed`, ingat untuk pemanggilannya `jangan`
pakai pemanggilan fungsi biasa yang pakai kurung buka dan tutup. Contohnya:

```js
...
computed: {
  total () {
    return this.props.price * this.data.quantity;
  },
},
...
<p>{this.computed.total}</p>
...
```

Baca tentang **computed dan reactivity dari computed** lebih lanjut [di sini](./docs/computed.md).

### Methods
Method adalah fungsi biasa, bisa pake argumen atau nggak, bisa pake return atau nggak, kalau
di React juga terserah mau pake fungsi biasa atau pakai `useCallback`. Deklarasinya berbentuk
fungsi biasa juga dengan pemanggilan `this.methods.namaFungsi(argumenKaloAda)`. Contohnya:

```js
...
methods: {
  toggleTotal () {
    this.data.showTotal = !this.data.showTotal;
  },
},
...
<button on={{ click: this.methods.toggleTotal }}>
  Toggle Total
</button>
// Atau
<button on={{ click: () => this.methods.toggleTotal() }}>
  Toggle Total
</button>
...
```

Baca tentang **methods dan reactivity dari methods** lebih lanjut [di sini](./docs/methods.md).

### Props
Props disini penulisannya nggak mirip dengan vue. Props dideklarasikan dulu pada
component dengan pasangan `propsName`: `default value`. Default value digunakan untuk
value pengganti ketika props nggak dipakai di pemanggilan jsx. Untuk pemanggilan props
di dalam komponen menggunakan `this.props.propsName`. Contoh penggunaannya:

```js
...
props: {
  price: 0,
},
...
computed: {
  total () {
    return this.props.price * this.data.quantity;
  },
},
...
<MyComponent price={10} />
```

Selain itu props disini juga bisa dipakai sebagai **callback** seperti halnya untuk menangani
**[controlled component](https://reactjs.org/docs/forms.html#controlled-components)** pada React.
Jadi disini saya nggak perlu membuat $emit hehe. Contoh:

```js
const ToggleButton = Fw.createComponent({
  props: {
    callback: () => {},
    value: false,
  },
  render () {
    return (
      <div>
        <button on={{ click: () => this.props.callback(!this.props.value) }}>
          Toggle Button
        </button>
      </div>
    );
  },
});

const MyComponent = Fw.createComponent({
  data: {
    show: false,
  },
  methods: {
    handleShowHello (show) {
      this.data.show = show;
    },
  },
  render () {
    return (
      <div>
        <p style={{ display: this.data.show ? 'block' : 'none' }}>Hello</p>
        <ToggleButton value={this.data.show} callback={this.methods.handleShowHello} />
      </div>
    );
  },
});
```

### Lifecycle Hooks
Lifecycle hooks adalah fungsi2 yg akan berjalan di kondisi tertentu di alur pembuatan
instance dari komponen. `created` dijalankan setelah semua unsur komponen telah diinisisasi
dan tepat sebelum komponen ter-render. `updated` dijalankan setiap sesuatu perubahan terjadi,
sehingga dijalankan setiap ada update dari virtual DOM. `destroyed` dijalankan ketika
node DOM dari suatu komponen dihilangkan dari real DOM atau gampangnya ketika awalnya
komponennya tampil jadi nggak tampil.

Semua unsur dari komponen bisa dipakai di lifecycle hooks, baik `props`, `data`, `computed`,
dan `methods` semua bisa dipanggil dari lifecycle hooks. Ini karena hook yg paling awal (`created`)
dipanggil setelah semua unsur komponen (`props`, `data`, `computed`,
dan `methods`) selesai diinisiasi.

Contoh penggunaannya:

```js
...
created () {
  this.data.bisaDiakses = 'bisa';
  console.info('component created');
},
updated () {
  console.info('component updated');
},
destroyed () {
  console.info('component destroyed');
},
...
```

### Render
Fungsi render adalah fungsi yang me-return `jsx`. Lah kok ajaib bisa pake `jsx` tanpa react?
Tentu bisa, ada beberapa library **virtual DOM** yang dibuat tanpa tergantung pada framework / 
library frontend tertentu. Nah disini saya pakai kombinasi antara **[snabbdom](https://github.com/snabbdom/snabbdom)**
dan **[@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx/)**.

Snabbdom adalah library **virtual DOM** yang punya fitur untuk bisa dituliskan dengan
[jsx](https://github.com/snabbdom/snabbdom#jsx), caranya dengan mengubah config `pragma`
dari @babel/plugin-transform-react-jsx. Nah, karena jsx nya pakai snabbdom, jadi cara penulisannya
ya ngikut dari [dokumentasinya snabbdom](https://github.com/snabbdom/snabbdom), contohnya:

1. Set atribut elemen HTML biasa
```html
<a attrs={{ href: 'https://github.com', target: '_blank' }}>
  Link ke github
</a>
```

2. Set class elemen HTML biasa
```html
<div class={{ foo: true, bar: true }} />
// Atau
<div attrs={{ class: 'foo bar' }} />
// Atau
<div class={{ 'foo bar': true }} />
```

3. Set style elemen HTML biasa
```html
<div
  style={{
    border: "1px solid #bada55",
    color: "#c0ffee",
    fontWeight: "bold",
  }}
/>
```

4. Pemakaian komponen dengan props (sudah saya jelaskan juga di bagian props)
```html
<ToggleButton value={this.data.show} callback={this.methods.handleShowHello} />
// Atau
<ToggleButton value={this.data.show} callback={(show) => this.methods.handleShowHello(show)} />
```

5. Conditional Rendering
Sebenarnya bisa dengan ini tapi entah kenapa bermasalah
```js
{this.data.show === true ? <MyComponent /> : []}
```
Jadi saya sarankan pakai show hide dengan css saja
```html
<p style={{ display: this.data.show ? 'block' : 'none' }}>Hello</p>
```

Nah sebenarnya selain pakai snabbdom bisa juga pakai library lain atau bahkan buat sendiri.
Tapi karena saya lebih ingin fokus ke konsep reactivity jadi saya pakainya snabbdom saja yg
sudah siap pakai. Lalu kalau ingin tau cara buat virtual DOM sendiri, ini ada course [create
your own react](https://www.udemy.com/course/create-your-own-react/) yg lumayan dari udemy,
jangan lupa belinya pas diskon aja. Selain itu mungkin bisa googling dengan keyword 
"create own virtual DOM" atau semacamnya.

### Router
Router di Fremwok-Fremwokan pakai routing hash, jadi nanti url nya semacam `example.com/#/home`.
Kenapa kok pake hash (#)? Karena ketika url pada window browser hanya berubah hash-nya, halamannya
nggak akan redirect (bayangkan kayak refresh halaman). Jadi tentu untuk dituliskan di tag a, href-nya
pakai semacam `href='#/home'`. Karena penerapannya cukup simple jadi saya pakai routing hash ini.
Contoh penggunaan:

```js
import Home from './pages/Home';
import Calculator from './pages/Calculator';

export const routes = {
  '/': Home,
  '/calculator': Calculator,
};

const Route = new Router(routes);

const rootComponent = {
  render () {
    return (
      <div>
        <ul>
          <li>
            <a attrs={{
              href: '#',
            }}>Home</a>
          </li>
          <li>
            <a attrs={{
              href: '#/calculator',
            }}>Calculator</a>
          </li>
        </ul>

        <Route />
      </div>
    );
  },
};

new Fw(rootComponent, document.body, {
  logger: [],
});
```

Sebagai pelengkap, router ini dilengkapi juga dengan halaman 404 kustom, tapi kalau nggak pakai
nanti bakal otomatis terpakai yg default. Contohnya:

```js
const Page404 = Fw.createComponent({
  render () {
    return (
      <div>
        <p style={{ textAlign: 'center' }}>404 - Page Not found.</p>
      </div>
    );
  },
});
...
const Route = new Router(routes, Page404);
...
```

### Store (Global State Management)
Gobal state management atau disini saya sebut store, saya buat mirip dengan [Redux](https://redux.js.org/).
Namun karena store yang saya buat saat ini masih belum modular dan diharuskan untuk menjadi 1 instance saja,
jadi penggunaan store harus diinisiasi pada 1 file misalnya pada contohnya pada file
[my-store.js](./example/store/my-store.js). Kalo pemanfaatannya pada komponen untuk saat ini
saya siapkan fungsi `bindState` untuk mengkonekkan state dari store ke komponen lewat `computed`,
dan `dispatch` untuk mengeksekusi `action` dari mana saja seperti di `methods`,
Sehingga sederhananya penggunaannya seperti ini:

```js
// File my-store.js
import { configureStore } from '../../src/Store';

const defaultState = {
  myNumber: 0,
  myName: null,
};

const myStore = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD':
      return { ...state, myNumber: state.myNumber + 1 };
    case 'SET_NAME':
      return { ...state, myName: action.payload };
    default:
      return state;
  }
};

export default configureStore(myStore);

// Pada komponen
import Fw from '../../src/Fw';
import myStore from '../store/my-store';

export default Fw.createComponent({
  ...
  computed: {
    myNumberFromStore: myStore.bindState('myNumber'),
  },
  methods: {
    addNumber () {
      myStore.dispatch({
        type: 'ADD',
      });
    },
  },
  ...
});
```

Baca tentang **store (global state management)** lebih lanjut [di sini](./docs/store.md).

### Logger
Logger ini saya siapkan buat debug atau pengen tau alur dari unsur2 di dalam komponen lewat
console browser. Ada beberapa logger yg bisa dipakai, yaitu `state`, `props`, `computed`,
`methods`, `dependency`, dan `lifecycle`. Penggunaannya dengan mendeklarasikan di pembuatan
application instance, contoh untuk menampilkan log alur state, props, dan computed:

```js
new Fw(rootComponent, document.body, {
  logger: ['state', 'props', 'computed'],
});
```

### Issue

Tentunya, karena Fremwok-Fremwokan saya buat dengan **cara paling simple** sesuai dengan intuisi
dan asumsi saya, jadi pastinya nantinya bakal banyak masalah kalau dipakai secara kompleks. Yaa
kembali ke tujuan semula framework ini untuk belajar, jadi saya biarkan kodingannya simple, hal-hal
seperti error handling dan sebagainya memang saya tinggal. Contoh beberapa issue yg saya temukan:
1. Conditional rendering dari jsx-nya yang agak bermasalah, belum tau karena plugin snabbdom nya
atau karena kodingan saya hehe.
2. Pemanggilan berulang fungsi2 yg sama waktu notify dipanggil, mungkin nanti bisa diatasi pakai
teknik debouncing.
3. Beberapa hal yg belum saya coba dan belum ada error handling, misal iseng2 `computed` diisi dengan
object bukan fungsi, atau keisengan lainnya.
4. Dll.
