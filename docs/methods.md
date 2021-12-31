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

## Reactivity Method di Fremwok-Fremwokan

Berlanjut ke reactivity ke 3, yaitu `method`, reactivity dari `method` ini saya buat mirip dengan 
`computed`.


