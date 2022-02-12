# Data

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

Data ini sifatnya reaktif, jadi semua yg pakai anggota dari data akan tau kalau isi dari anggota tersebut
berubah. Dari contoh diatas, computed total itu tahu kalau misal data quantity berubah. Nah sekarang pertanyaannya,
gimana caranya?

## Reactivity

Kalo kita baca [dokumentasi Vue tentang reactivity](https://vuejs.org/v2/guide/reactivity.html), disitu ditulis:

>When you pass a plain JavaScript object to a Vue instance as its data option, Vue will walk through all of its properties
>and convert them to getter/setters using Object.defineProperty.

intinya pakai setter getter, itu aja, jadi data yg awalnya di deklarasikan dari
```js
data: {
  quantity: 20,
},
```

akan menjadi

```js
data: {
  get quantity () {
    //
  },
  set quantity (newQuantity) {
    //
  },
},
```

Lalu apa spesialnya setter getter? jawabannya kembali ke dokumentasi Vue

> The getter/setters are invisible to the user, but under the hood they enable Vue to perform dependency-tracking
> and change-notification when properties are accessed or modified.

Setter dan getter adalah fungsi biasa, jadi kita bisa melakukan apapun didalam blok fungsi setter
atau getter. Contohnya:

```js
data: {
  get quantity () {
    //
    console.log('hey nilai quantity lagi dipake');
    //
  },
  set quantity (newQuantity) {
    //
    console.log('hey nilai quantity lagi diubah');
    //
  },
},
```

Untuk lebih jelasnya perhatikan penjelasan dibawah ini, kode2 ini bisa dijalankan di console browser.

Misal kita punya kodingan seperti ini
```js
const price = 1000
let quantity = 5
let total = 0;

function calculate () {
  total = price * quantity;
}
```

Apabila kita jalankan fungsi `calculate` tentu nanti nilai `total` bakal berubah dari 0 jadi 5000 kan.
Nah misal setelah itu kita ganti nilai `quantity` dari 5 jadi 6, berapa nilai `total` sekarang? jawabannya
tetap **5000**, karena fungsi `calculate` nggak dipanggil lagi.

```js
const price = 1000
let quantity = 5
let total = 0;

function calculate () {
  total = price * quantity;
}

calculate();

console.log(total);
// hasilnya 5000

quantity = 6;

console.log(total);
// kok masih tetep 5000 ?
```

Nah terus gimana caranya biar totalnya otomatis berubah tanpa panggil `calculate` terus? Oke sekarang
kita ubah kodingannya jadi gini:

```js
const price = 1000
let total = 0;

let targetFungsi = null;
const state = {
  _quantity: null,
  ygPakeQuantity: null,
  get quantity () {
    this.ygPakeQuantity = targetFungsi;
    return this._quantity;
  },
  set quantity (newQuantity) {
    this._quantity = newQuantity;
    if (typeof this.ygPakeQuantity === 'function') {
      this.ygPakeQuantity();
    }
  },
}

state.quantity = 5;

function calculate () {
  total = price * state.quantity;
}

targetFungsi = calculate;
calculate();
targetFungsi = null;

console.log(total);
// hasilnya 5000

state.quantity = 6;

console.log(total);
// yay hasilnya 6000 !
```
Dari kodingan diatas jelas membingungkan wkwk saya juga bingung gimana ngasih contoh paling simple.
Jadi kalo dibuat langkah2 jadinya gini:

1. Siapkan variable2 biasa seperti `price` dan `total`.
2. Untuk `quantity` sekarang kita ubah jadi reactive.
3. Kita bisa lihat deklarasi `let targetFungsi = null`, `targetFungsi` ini dipakai sebagai variable
temporary untuk menyimpan fungsi yang memakai nilai dari state `quantity`.
4. Pada object `state`, pertama kita deklarasikan `_quantity` sebagai internal value atau penyimpanan
nilai quantity, karena kita butuh penampung ketika memasukkan nilai pada setter.
5. Lalu dekalarasikan `ygPakeQuantity`, apaan sih ini? `ygPakeQuantity` itu adalah fungsi yang nantinya
mengakses nilai dari state `quantity`, lalu bedanya sama `targetFungsi` tadi apa? ya kita lanjut dulu wkwk
6. Nah disini kita baru masuk ke pembuatan **getter**, fungsi getter akan dipanggil tiap nama getternya dipanggil
tanpa memakai tanda sama dengan (=), contohnya pada fungsi `calculate` yg memanggil `state.quantity`, nah
dari sini kita bisa membuat setiap kali fungsi getter dipanggil, maka akan menyimpan fungsi lain yang
memanggilnya yaitu dengan `this.ygPakeQuantity = targetFungsi`;
7. Selanjutnya **setter**, fungsi setter dipanggil ketika nama setternya dipanggil dengan memakai tanda
sama dengan (=), contohnya `state.quantity = 5` atau `state.quantity = 6`, disini karena waktu di getter
kita sudah **menyimpan fungsi** yang mengakses `state.quantity`, jadi untuk setter kita tinggal **running ulang**
saja fungsi yang kita simpan itu.
8. Nah karena sudah selesai membuat object `state`, kita coba mengubah nilai quantity menjadi 5 dengan `state.quantity = 5`,
harusnya dari penjelasan **nomor 7** kan nanti kalo di set bakal dijalankan fungsi yg disimpan, tapi karena disini
getter belum pernah dipakai, maka waktu setter berjalan ya hanya menyimpan nilai baru ke internal value `_quantity` saja.
9. Masuk ke fungsi `calculate`, yay akhirnya disini getter kita dipake! lalu apakah sekarang fungsi `calculate`
sudah disimpan ke `ygPakeQuantity`? jawabannya belum, karena fungsi `calculate` cuma di deklarasikan, jadi kode2
yg didalamnya belum di jalankan, jadi lanjut dulu ke nomor 10.
10. Disini kita masuk ke bagian inti, disini ada `targetFungsi = calculate`, kenapa `calculate` nya nggak pakai kurung
kayak kalau panggil2 fungsi seperti biasa, kenapa kok nggak `targetFungsi = calculate()`? itu karena tujuannya untuk
meng-copy fungsi `calculate` ke `targetFungsi`, jadi yang sebelumnya `targetFungsi` isinya null, sekarang jadi sebuah
fungsi yg blok kodenya sama seperti `calculate`.
11. Selanjutnya, akhirnya kita menjalankan fungsi `calculate`, dan seperti yg saya katakan pada **nomor 9** getter quantity
sekarang dijalankan, karena `calculate` sudah bukan cuma deklarasi saja, tetapi sudah running ketika dipanggil `calculate()`.
Jadi sekarang fungsi calculate tersimpan di `ygPakeQuantity`.
12. Sehingga ketika nilai `state.quantity` diubah ke angka 6 dengan `state.quantity = 6`,
maka fungsi setter akan dijalankan yang selanjutnya fungsi yang tersimpan di `ygPakeQuantity` akan otomatis dijalankan ulang.
13. Jadilah nilai `total` yang asalnya 5000 sekarang otomatis jadi 6000.

Sebelumnya mohon maaf jika apa yang saya jelaskan benar2 membingungkan hehe. Paling recomended sih silakan tonton
**[Course reactivity dari Vue Mastery](https://www.vuemastery.com/courses/advanced-components/build-a-reactivity-system)**
kalau lagi ada diskon atau ada akses gratis.

## Spesifikasi State di Fremwok-Fremwokan

1. `Data` bisa diambil (get) atau diubah (set) value-nya.
2. Kalau nilai `data` berubah, semua yg mengakses `data` mendapatkan nilai `data` yg baru.

## Reactivity State di Fremwok-Fremwokan

Di Fremwok-Fremwokan, reactivity nggak cuma berlaku buat `state` (`data`) aja, tapi juga
`computed` dan `method`, karena masing2 perlu memberi tahukan kalo nilainya berubah.
Untuk `state`, inisiasi menjadi reactive dilakukan oleh kombinasi dari method `initState`
dan class `Dependency`. Method `initState` digunakan untuk membuat setter dan getter, sedangkan
class `Dependency` digunakan untuk membuat **observer** fungsi (seperti `ygPakeQuantity` di contoh sebelumnya).

Class `Dependency` terdiri dari method `depend` dan `notify`. Method `depend` dipakai untuk menyimpan fungsi2
yg mengakses object2 yang reactive (mengakses `data`,`computed` dan `method`) seperti penggunaan 
`this.ygPakeQuantity = targetFungsi` pada contoh sebelumnya. Dan untuk method `notify` dipakai untuk
memanggil fungsi2 yang sudah disimpan method `depend` tadi, sama kayak pemanggilan `this.ygPakeQuantity()`.
```js
class Dependency {
  /**
   * Create an observer storage to store functions that depend on a reactive object.
   */
  constructor () {
    this.subscribers = [];
    this.subscribersName = [];
  }

  depend (source) {
    if (Dependency.targetName && !this.subscribersName.includes(Dependency.targetName)) {
      this.subscribersName.push(Dependency.targetName);
      this.subscribers.push(Dependency.target);
    }
  }

  notify (source) {
    this.subscribers.forEach(sub => sub());
  }
}
```

`initState` melakukan iterasi tiap anggota object data untuk dijadikan setter dan getter
menggunakan `Object.defineProperty` (seperti yg dilakukan Vue). Bedanya dari contoh yg saya buat
di atas, penyimpanan dan pemanggilan fungsi2 yang mengakses state akan menjadi tanggung jawab
class `Dependency`.
```js
// Deklarasi Component
...
data: {
  quantity: 20,
  showTotal: false,
},
...

// Class Fw
...
initState (data) {
  if (data) {
    Object.keys(data).forEach(key => {
      let internalValue = data[key];

      const dep = new Dependency();

      Object.defineProperty(data, key, {
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

Lalu bagaimana caranya supaya class `Dependency` tau kalo suatu fungsi sedang mengakses object yg
reactive? kita bisa lihat pada class `Dependency`, pada method `depend` yang disimpan adalah
`Dependency.target` yg kalau di contoh sebelumnya adalah `targetFungsi`. `Dependency.target` nantinya
disimpan pada array `this.subscribers` yaitu pada `this.subscribers.push(Dependency.target)`.
Nah dari sini kita tau kalau kita mau meng-observasi suatu fungsi, fungsi itu dimasukkan dulu ke
`Dependency.target`. Selain itu untuk menangani kemungkinan duplikasi fungsi yang masuk ke `subscriber`
maka digunakan `Dependency.targetName`, Contohnya seperti ini:

```js
// Class Fw
...
watch (name, func) {
  Dependency.targetName = name;
  Dependency.target = func;
  Dependency.target();
}
...
render () {...}
...
constructor () {
  ...
  this.watch('render', this.render);
}
...
```

Method `watch` berguna untuk meng-copy fungsi yang nantinya memakai object2 yg reactive
(`Dependency.target = func`) dan sekaligus menjalankannya (`Dependency.target()`). Penggunaannya
contohnya pada method `render`. Jika pada waktu target dijalankan dengan `Dependency.target()`,
yg diasumsikan kali ini method `render` dijalankan, dan didalam method `render` memanggil getter
dari object2 atau dalam hal ini `data` yang reactive, maka `dep.depend()` dalam fungsi getter
akan dijalankan sehingga method `render` masuk ke dalam `subscribers` jika belum pernah masuk.
Lalu pada saat setter dari object2 reactive berjalan, dalam hal ini akan memanggil `dep.notify()`,
maka method `render` yg tadi masuk ke `subscribers` akan otomatis dijalankan ulang.

Daan beginilah ceritanya bagaimana `data` menjadi reactive. Sekali lagi mohon maaf kalau penjelasannya
membingungkan wkwk.

### Note

Yang saya tulis disini adalah konsepnya, mungkin ada yang berbeda dari implementasinya jadi untuk
lebih lengkapnya silakan lihat [source code-nya](../src/Fw.js).

### [Next >](./computed.md)
