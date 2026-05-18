function Input({
  label,
  type,
  placeholder,
  isMandatory,
  value,
  setValue,
  rows,
  className,
  multiple,
  selectValues,
  selectAttributeId,
  selectAttributeValue,
  selectProperty
}) {
  return (
    <div className={`w-full mt-3 ${className}`}>
      <p className='text-[12px]'>{label} <span className='text-red-600'>{isMandatory && `*`}</span></p>
      <div>
        {
          (() => {
            if (type === "textarea") {
              return (
                <textarea
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  name=""
                  id=""
                  rows={rows}
                  className={`border p-2 text-sm w-full`}
                ></textarea>
              )
            } else if (type === "select") {
              return (
                <select
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  name=""
                  id=""
                  className={`border p-2 text-sm w-full`}
                >
                  <option value="">{selectProperty}</option>
                  {
                    selectValues.map((item, index) => (
                      <option value={item[selectAttributeId]} key={index}>{item[selectAttributeValue]}</option>
                    ))
                  }
                </select>
              )
            } else if (type === "file") {
              return (
                <div className='mt-3'>
                  <label htmlFor="input" className='py-3 px-5 border'>+ Tambah foto</label>
                  <input
                    value={value}
                    onChange={e => setValue(e.target.files)}
                    type={type}
                    placeholder={placeholder}
                    name=""
                    id="input"
                    multiple={multiple}
                    className={`border p-2 text-sm w-full hidden`}
                  />
                </div>
              )
            } else {
              return (
                <input
                  value={value}
                  onChange={type === "file" ? e => setValue(e.target.files) : e => setValue(e.target.value)}
                  type={type}
                  placeholder={placeholder}
                  name=""
                  id=""
                  multiple={multiple}
                  className={`border p-2 text-sm w-full`}
                />
              )
            }
          })()
        }
      </div>
    </div>
  )
}

export default Input