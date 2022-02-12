# Store (Global State Management)
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

## Spesifikasi Store di Fremwok-Fremwokan

1. Single source of truth, jadi `store` yg diakses di tiap komponen bakal jadi 1 instance saja.
2. State dari `store` reactive.
3. State dari `store` diakses melalui `bindState` yang dideklarasikan pada `computed`.
4. State dari `store` tidak bisa diubah (set) nilainya secara manual (pakai sama dengan).
5. Untuk mengubah nilai state dari `store` harus pakai `dispatch`.

## Konsep Store di Fremwok-Fremwokan

Kenapa kok deklarasi `reducer` di `Redux` bentuknya fungsi biasa dengan argumen berupa
`initial state` dan `action`? kayak di bawah ini:

```js
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
```

Biar bisa tau rahasianya, coba jalankan kode ini, bisa lewat console nya browser.

```js
let myData;
myData = myStore(myData, {});
```

dari kode diatas harusnya hasilnya `{ myNumber: 0, myName: null }`. Setelah itu lanjutkan dengan
jalankan kode ini:

```js
myData = myStore(myData, { type: 'ADD' });
```

nah kode diatas bakal menghasilkan `{ myNumber: 1, myName: null }`, alias `myNumber`nya nambah jadi 1.
Percobaan bisa dilanjutkan dengan mencoba kode dibawah ini:

```js
myData = myStore(myData, { type: 'SET_NAME', payload: 'JONO' });
```

maka akan menghasilkan `{ myNumber: 1, myName: 'JONO' }`. Percobaan2 ini adalah **konsep sederhana dari reducer**.

Untuk penjelasannya, kita lihat dari percobaan pertama, disini dideklarasikan variable `myData` dan tidak diisi
nilai apapun. Dengan tidak mengisikan nilai apapun yang artinya `undefined`, maka ketika menjalankan baris kedua, yaitu
`myData = myStore(myData, {});` sama dengan memanggil `myStore(undefined, {})`. Nah, kalau di js, ketika
memanggil fungsi dengan argumen `undefined` atau nggak diisi, maka akan pakai argumen default kalau ada, yang
disini  argumen `state` yang dipanggil dengan `undefined` nanti akan menggunakan nilai defaulnya yaitu `defaultState`.
Selanjutnya untuk argumen `action` diisi dengan `{}` atau objek kosongan, jadi ketika masuk
ke `switch`, karena nggak ada `case undefined` maka akan masuk ke blok `default` dimana me-return argumen `state`.
Dari sini awal mulanya kenapa kok di percobaan 1 hasilnya `{ myNumber: 0, myName: null }` alias sama degnan
`defaultState`. Dan dengan cara ini **pengambilan nilai awal store** dilakukan.

Untuk percobaan kedua dan ketiga, karena pada percobaan pertama variable `myData` sudah berisi `defaultState`,
jadi nilai `myData` sudah bisa berubah sesuai dengan `action` yang digunakan.

## Reactivity Store di Fremwok-Fremwokan

Sifat dari `global state` ini sama seperti [`data`](./state.md) atau `internal state` pada component yang harus
bisa reactive. Dan untuk pembuatan reactivity-nya saya samakan juga dengan `data`. Hanya perlu sedikit modifikasi
untuk menggunakan data yang asalnya dari definisi `reducer` atau `store` diatas.


```js
// Class Store
...
initStore () {
  const data = this.storeFunction(this.store, {});
  if (data && !this.store) {
    this.store = {};
    Object.keys(data).forEach(key => {
      let internalValue = data[key];

      const dep = new Dependency();

      Object.defineProperty(this.store, key, {
        get () {
          dep.depend();
          return internalValue;
        },
        set (newValue) {
          if (internalValue !== newValue) {
            internalValue = newValue;
            dep.notify();
          }
        },
      });
    });
  }
}
...
```

Reactivity pada store diinisiasi pada saat pengambilan nilai awal store, seperti percobaan pertama diatas.
`store` nantinya akan disimpan pada property `store` pada class `Store`, dan fungsi dari `reducer` disimpan pada
property `storeFunction`, sehingga pengambilan nilai awalnya dengan cara `const data = this.storeFunction(this.store, {})`,
atau sebenernya pakai `const data = this.storeFunction(undefined, {})` juga bisa, terserah sih. Dari situ tinggal
dilakukan hal yang sama seperti [pembuatan reactivity di `data` component](./state.md).

## `bindState` dan `dispatch`

`bindState` disini seperti `mapStateToProps` menggunakan fungsi `connect` di `Redux`. Namun untuk `store` dari
Fremwok-Fremwokan melakukan mapping ke `computed` tapi karena saya buatnya supaya di konek-kan 1 1 state nya
jadi saya namakan `bindState`. `bindState` akan cukup dilakukan untuk me-return `getter` state sesuai nama yg
diinginkan.

```js
// Class Store
...
bindState (name) {
  return () => {
    return this.state[name];
  };
}
...
```

Dari kode diatas, yang di-return itu fungsi, jadi fungsi returnya fungsi, itu karena nantinya `bindState` akan
dipakai di `computed` yang membutuhkan fungsi sebagai deklarasi. Jadi dari contoh di atas sendiri dari deklarasi

```js
computed: {
  myNumberFromStore: myStore.bindState('myNumber'),
},
```

seolah akan menjadi

```js
computed: {
  myNumberFromStore () {
    return this.state.myNumber;
  },
},
```

Selanjutnya, karena `state` dari `store` sudah reactive, maka `computed myNumberFromStore` akan menjadi dependency
dari `state myNumber`. Sehingga ketika nilai `myNumber` berubah, nilai `computed myNumberFromStore` akan ikut berubah.

Untuk `dispatch`, disini seperti `dispatch` yang ada di redux, dimana akan mengubah nilai `state` sesuai `action`
yang menjadi argumen. Jadi implementasinya cukup menerapkan seperti percobaan kedua dan ketiga yang tadi.

```js
// Class Store
...
dispatch (action) {
  const newStore = this.storeFunction(this.store, action)
  Object.keys(newStore).forEach(key => {
    this.store[key] = newStore[key];
  });
}
...
```

Dari kode diatas, saya melakukan `Object.keys(newStore).forEach` untuk mengubah nilai `this.store`,
ini karena jika hanya menggunakan `this.store = newStore`, maka js menganggap yang berubah adalah `this.store`
bukan tiap `state` dari `this.store` jadi `getter` yang tadi sudah dideklarasikan untuk membuat reactivity tidak
akan terpanggil, sehingga caranya supaya `getter`nya ikut terpanggil adalah dengan menggunakan `forEach`
seperti kode di atas.

### Note

Yang saya tulis disini adalah konsepnya, mungkin ada yang berbeda dari implementasinya jadi untuk
lebih lengkapnya silakan lihat [source code-nya](../src/Store.js).

### [< Previous](./method.md) ...... [Balik ke README >](../README.md)
