import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/apiVersion',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/apiVersion/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/apiVersion',
    method: 'put',
    data
  })
}

export function query(data) {
  return request({
    url: 'api/apiVersion/' + data,
    method: 'get'
  })
}

export default { add, edit, del, query }
