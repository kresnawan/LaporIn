import _ from "lodash";

// return (1, 2, 3) from [1, 2, 3]
export function parseArrayOfObjectToMySQLIn(arr, attribute) {
  let str = "(";
  for (var i in arr) {
    str = str + `${arr[i][attribute]}, `;
  }

  str = str.slice(0, str.length - 2);
  str = str + ")";

  return str;
}

export function createDateMySQL() {
  const jsDateObject = new Date();
  const year = jsDateObject.getFullYear();
  const month = (jsDateObject.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
  const day = jsDateObject.getDate().toString().padStart(2, "0");
  const hours = jsDateObject.getHours().toString().padStart(2, "0");
  const minutes = jsDateObject.getMinutes().toString().padStart(2, "0");
  const seconds = jsDateObject.getSeconds().toString().padStart(2, "0");

  const mysqlDatetimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return mysqlDatetimeString;
}

export function turnArrayToMySQLQuery(array, jadwalId) {
  let str = "";
  for (var i in array) {
    str = str + `('${jadwalId}','${array[i].id}'), `;
  }

  str = str.slice(0, str.length - 2);

  return str;
}

// (panjang, lebar, nota_id, nama_barang, harga_per_meter)

export function insertBarangBeratParser(array, notaId) {
  let str = "";
  for (var i in array) {
    str =
      str +
      `('${array[i].panjang}', '${array[i].lebar}', '${notaId}', '${array[i].nama_barang}', '${array[i].harga_per_meter}'), `;
  }

  str = str.slice(0, str.length - 2);

  return str;
}

export function insertBarangRinganParser(array, notaId) {
  let str = "";
  for (var i in array) {
    str =
      str +
      `('${array[i].jumlah}', '${notaId}', '${array[i].nama_barang}', '${array[i].harga_per_pcs}'), `;
  }

  str = str.slice(0, str.length - 2);

  return str;
}

export function fuseBarang(barangRingan, barangBerat) {
  var reducedBarangBerat = [];
  for (var i = 0; i < barangBerat.length; i++) {
    reducedBarangBerat[i] = {
      ...barangBerat[i],
      jumlah: `${barangBerat[i].panjang}x${barangBerat[i].lebar}`,
    };
  }

  const fused = [...barangRingan, ...reducedBarangBerat];

  return fused;
}

export function toCurrency(integer) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  const sliced = formatted.format(integer);
  return sliced.slice(4, sliced.length);
}

console.log(toCurrency(900000000));

export function createCurrentDateMySQL() {
  const jsDateObject = new Date();
  const year = jsDateObject.getFullYear();
  const month = (jsDateObject.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
  const day = jsDateObject.getDate().toString().padStart(2, "0");

  const mysqlDatetimeString = `${year}-${month}-${day}`;
  return mysqlDatetimeString;
}

export function filterBarang(tipe, array, notaId) {
  var result = [];

  if (tipe === "ringan") {
    for (let i = 0; i < array.length; i++) {
      const obj = {
        jumlah: parseInt(array[i].jumlah),
        nota_id: notaId,
        nama_barang: array[i].nama_barang,
        harga_per_item: parseInt(array[i].harga_per_pcs),
      };

      result.push(obj);
    }

    return result;

  } else if (tipe === "berat") {
    for (let i = 0; i < array.length; i++) {
      const obj = {
        panjang: parseInt(array[i].panjang),
        lebar: parseInt(array[i].lebar),
        nota_id: notaId,
        nama_barang: array[i].nama_barang,
        harga_per_meter: parseInt(array[i].harga_per_meter),
      };

      result.push(obj);
    }

    return result;
  }
}

// console.log(insertBarangBeratParser(arraay, 'yoK2C1jn'));
// console.log(insertBarangRinganParser(arrayBarangRingan, 'yoK2C1jn'));
