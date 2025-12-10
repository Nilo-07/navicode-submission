import React, { useEffect, useMemo, useState } from 'react'
import './index.css'

const API_BASE = 'http://localhost:5001/api/products' // match your backend PORT

export default function App() {
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Modal / form state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({ name: '', weight: '', price: '' })

  // Load products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(API_BASE)
        if (!res.ok) {
          throw new Error('Failed to load products')
        }
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error(err)
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let res = products.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q)
      const created = p.createdAt ? new Date(p.createdAt).toISOString().toLowerCase() : ''
      const createdMatch = created.includes(q)
      return nameMatch || createdMatch
    })

    if (sortBy === 'price') res = [...res].sort((a, b) => a.price - b.price)
    else if (sortBy === 'weight') res = [...res].sort((a, b) => a.weight - b.weight)
    else res = [...res].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return res
  }, [products, query, sortBy])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filtered.slice(startIndex, startIndex + itemsPerPage)
  }, [filtered, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const openAdd = () => {
    setEditingProduct(null)
    setForm({ name: '', weight: '', price: '' })
    setIsModalOpen(true)
  }

  const openEdit = (p) => {
    setEditingProduct(p)
    setForm({ name: p.name, weight: String(p.weight), price: String(p.price) })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const saveProduct = async () => {
    const name = form.name.trim()
    const weight = Number(form.weight)
    const price = Number(form.price)

    if (!name || Number.isNaN(weight) || Number.isNaN(price)) {
      alert('Please provide valid name, weight and price')
      return
    }

    try {
      setError(null)

      // EDIT
      if (editingProduct) {
        const res = await fetch(`${API_BASE}/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, weight, price }),
        })
        if (!res.ok) {
          throw new Error('Failed to update product')
        }
        const updated = await res.json()
        setProducts((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        )
      } else {
        // CREATE
      const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, weight, price }),
        })
        if (!res.ok) {
          throw new Error('Failed to create product')
        }
        const created = await res.json()
        setProducts((prev) => [created, ...prev])
      }

      closeModal()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error while saving product')
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return

    try {
      setError(null)
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('Failed to delete product')
      }
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error while deleting product')
    }
  }

  const formatCurrency = (v) =>
    new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }).format(v)

  const formatDate = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleString()
  }

  return (
    <div className="container">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h1 className="text-2xl font-semibold">Products</h1>

          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="border rounded px-3 py-2 w-56"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-2 py-2"
            >
              <option value="createdAt">Sort: Newest</option>
              <option value="price">Sort: Price</option>
              <option value="weight">Sort: Weight</option>
            </select>

            <button
              onClick={openAdd}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Create New
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                    Created At
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                    Weight
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                    Price
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {p.weight} kg
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => alert(JSON.stringify(p, null, 2))}
                          className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600"
                        >
                          Show
                        </button>
                        <button
                          onClick={() => deleteProduct(p._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <Modal
          open={isModalOpen}
          title={editingProduct ? 'Edit Product' : 'Add Product'}
          form={form}
          setForm={setForm}
          onCancel={closeModal}
          onSave={saveProduct}
        />
      </div>
    </div>
  )
}

// Modal component
function Modal({ open, title, form, setForm, onCancel, onSave }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        <div className="flex flex-col gap-3">
          <label className="text-sm">Name</label>
          <input
            value={form.name}
            onChange={(e) =>
              setForm((s) => ({ ...s, name: e.target.value }))
            }
            className="border rounded px-3 py-2 w-full"
          />

          <label className="text-sm">Weight (kg)</label>
          <input
            value={form.weight}
            onChange={(e) =>
              setForm((s) => ({ ...s, weight: e.target.value }))
            }
            className="border rounded px-3 py-2 w-full"
          />

          <label className="text-sm">Price</label>
          <input
            value={form.price}
            onChange={(e) =>
              setForm((s) => ({ ...s, price: e.target.value }))
            }
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button onClick={onSave} className="px-3 py-1 bg-blue-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
