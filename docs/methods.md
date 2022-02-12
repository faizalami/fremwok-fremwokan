# Methods
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

## Spesifikasi Method di Fremwok-Fremwokan

1. `Method` hanya bisa diambil (get) function-nya.
2. `Method` tidak bisa diubah (set) function secara manual (pakai sama dengan).
3. `Method` bisa punya return value atau tidak.
4. `Method` bisa dipanggil secara langsung pada `methods` lain, `render`, dan **lifecycle hooks**.
5. `Method` bisa dipanggil menjadi callback.
6. Kalau nilai object2 reactive dalam `method` berubah, semua yg mengakses `method` mendapatkan function
`method` yang baru.

## Reactivity Method di Fremwok-Fremwokan

Berlanjut ke reactivity ke 3, yaitu `method`, reactivity dari `method` jujur saja cukup rumit dan lumayan
membuat saya pusing wkwk. Berbeda dengan `computed` yang akan langsung diambil return value-nya, `method`
tidak boleh langsung dieksekusi, yang boleh mengeksekusi `method` hanya yang mengakses `method` misalkan
pada contoh diatas, yang boleh mengeksekusi method **hanya event klik button**, jadi walaupun fungsi `render`
dijalankan ulang, `method` hanya akan dieksekusi ketika button di klik. Bayangkan jika pada `method` menjalankan
fungsi `alert('test')`, jika `method` dieksekusi langsung, maka tiap `render` akan ada teror alert di browser.

Diluar itu, `method` ini juga harus reactive, tapi disini reactive-nya saya buat untuk meneruskan (bypass)
object2 reactive lain yang ada di dalam `method`, yaitu antara `data` dan `computed`. Dari contoh diatas,
`this.methods.toggleTotal` dipakai pada `render`, jadi `render` akan menjadi dependency dari method `toggleTotal`.
Selanjutnya didalam method `toggleTotal`,  `this.data.showTotal` dipakai, yang menjadikan method `toggleTotal`
sebagai dependency-nya data `showTotal`. Sehingga misal nilai data `showTotal` berubah, data `showTotal` akan
memberi `notify` ke method `toggleTotal`, dan method `toggleTotal` langsung meneruskan untuk `notify` ke `render`.

Dari keruwetan2 `method` tersebut, akhirnya saya mencetuskan pembuatan reactivity dari `method` seperti ini:

```js
// Class Fw
...
initMethods (methods) {
  if (methods) {
    Object.keys(methods).forEach(key => {
      const methodFunction = methods[key].bind(this.component);
      let firstRender = true;
      const dep = new Dependency();

      const initGetter = (...args) => {
        if (firstRender) {
          dep.depend();

          this.watch(`methods:${key}`, () => {
            if (!firstRender) {
              dep.notify();
            }
          });
          firstRender = false;
        }

        return methodFunction(...args);
      };

      Object.defineProperty(this.component.methods, key, {
        get () {
          return initGetter;
        },
        set () {
          throw new Error('Don\'t set methods value manually.');
        },
      });
    });
  }
}
...
```

Pembuatan reactivity pada `methods` berfokus pada fungsi `initGetter`. Mengapa kok nggak langsung langsung saja
me-return `(...args) => {....` ? karena kalau dilakukan seperti itu, `this.watch` akan undefined, karena fungsi
`get` pada `Object.defineProperty` sudah berbeda scope dari class `Fw`. Dengan cara seperti itu juga, mengakibatkan
instance dari fungsi `initGetter` pada memory akan berubah, sehingga disini digunakan flag `firstRender` untuk
menangani kondisi ketika `dep.depend()`, `watch`, dan `dep.notify()`.

`dep.depend()` dipanggil ketika pertama kali saat method dipanggil (dieksekusi), misal pada contoh pemanggilan
`this.methods.toggleTotal()`. `dep.depend()` tidak dipanggil ketika method cuma diakses getter-nya tanpa dieksekusi,
misal `<p>this.methods.toggleTotal</p>`, lalu kenapa pada contoh ada `click: this.methods.toggleTotal`? ini termasuk
pemanggilan fungsi juga, `click` disini adalah fungsi melakukan return callback, katakanlah misal `return callback(event)`,
jadi `click: this.methods.toggleTotal` sama dengan `click: () => this.methods.toggleTotal()` atau `click: (event) => this.methods.toggleTotal()`.

Selanjutnya, yang aneh `watch` hanya memanggil fungsi untuk melakukan `dep.notify()`, inilah yang saya sebut
`method` hanya melakukan bypass (meneruskan) `notify` dari `data` atau `computed`. Lalu pengecekan `!firstRender`
digunakan untuk mencegah `method` melakukan `notify` langsung setelah `depend`. Bagaimana jika tidak ada `data`
atau `computed` yang diakses `method`? ya seharusnya `method` tidak akan melakukan `notify`.

### Note

Yang saya tulis disini adalah konsepnya, mungkin ada yang berbeda dari implementasinya jadi untuk
lebih lengkapnya silakan lihat [source code-nya](../src/Fw.js).

### [< Previous](./computed.md) ...... [Next >](./store.md)
