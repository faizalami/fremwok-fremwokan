# Computed
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

## Spesifikasi Computed di Fremwok-Fremwokan

1. `Computed` hanya bisa diambil (get) return value-nya.
2. `Computed` tidak bisa diubah (set) nilainya secara manual (pakai sama dengan).
3. Kalau nilai `computed` berubah, semua yg mengakses `computed` mendapatkan nilai `computed` yg baru.

## Reactivity Computed di Fremwok-Fremwokan

Seperti yg saya jelaskan pada [dokumentasinya data](./state.md), `computed` ini termasuk salah
satu yg reactive, karena setiap fungsi yg memakai `computed` ini juga perlu dijalankan ulang
kalau nilai dari `computed` berubah. Tetapi disini penerapannya reactivity-nya berbeda dengan
`data`. Seperti yg sudah diketahui kalau untuk mengakses computed sifatnya **read-only**, seperti
pada contoh di atas, untuk mengakses computed `total` hanya dapat dengan mengambil nilainya dalam
bentuk `this.computed.total`, jadi tidak bisa diubah nilainya dengan `this.computed.total = 100`.
Maka disini didapat kesimpulan kalau setter dari computed bakal **dinonaktifkan**. Lalu bagaimana
cara mengetahui kalau nilai computed berubah? caranya seperti ini:

```js
// Class Fw
...
initComputed (computed) {
  if (computed) {
    Object.keys(computed).forEach(key => {
      const computedFunction = computed[key];
      let internalValue = null;
      const dep = new Dependency();

      this.watch(`computed:${key}`, () => {
        internalValue = computedFunction();
        dep.notify();
      });

      Object.defineProperty(this.component.computed, key, {
        get () {
          dep.depend();
          return internalValue;
        },
        set () {
          throw new Error('Don\'t set computed value manually.');
        },
      });
    });
  }
}
...
```

Kalau bertanya2 bagaimana bisa computed yg deklarasinya sebagai fungsi tapi kok pas aksesnya nggak
pakai kurung, jawabannya karena berubah jadi getter. Return hasil dari menjalankan fungsi yang
dideklarasikan di computed nantinya akan menjadi internal value dari computed. Perubahan dari
internal value inilah yang nantinya akan menjadi dasar untuk melakukan `dep.notify()`.

Kalau dilihat, ada yang menarik, kenapa kok ada method `watch` dipanggil disitu? itu karena ada saatnya
**computed akan memanggil nilai dari data**. Getter dari data akan dipanggil waktu pemanggilan
fungsi computed untuk mengisi nilai internal value yang baru, tepatnya pada `internalValue = computedFunction()`.
Contohnya pada computed `total` diatas menggunakan data `this.data.quantity`, jadi getter `quantity`
akan terpanggil ketika `internalValue = computedFunction()`. Sehingga fungsi yang nanti akan menjadi
dependency dari data `quantity` dan dijalankan ketika nilai `quantity` berubah adalah:

```js
() => {
  internalValue = computedFunction();
  dep.notify();
}
```

Kita juga melihat kalau argumen `name` dari method `watch` diisi dengan `computed:${key}` untuk memberi
nama yang unik untuk `Dependency.targetName`, sehingga mencegah duplikasi fungsi yang masuk ke `subscribers`.
Untuk contoh diatas, nama yg masuk ke `Dependency.targetName` adalah `computed:total`.

Seperti kita lihat juga kalau computed ini juga punya `dep.depend()` pada getter dan `dep.notify()`
setelah merubah nilai dari internal value. Pada contoh, dapat dilihat jika computed `total` dipakai
di method `render` dengan `<p>{this.computed.total}</p>`, sehingga method `render` menjadi dependency
dari computed `total` lalu ketika nilai computed `total` ini berubah, otomatis method `render` akan
dijalankan ulang. Inilah reactivity pada `computed`.

### Note

Yang saya tulis disini adalah konsepnya, mungkin ada yang berbeda dari implementasinya jadi untuk
lebih lengkapnya silakan lihat [source code-nya](../src/Fw.js).

### [< Previous](./state.md) ...... [Next >](./methods.md)
