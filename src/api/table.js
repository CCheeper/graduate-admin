import request from '@/utils/request'

export function getList(searchInfo, current, size) {
  return request({
    url: '/user/list',
    method: 'get',
    params: {
      searchInfo,
      current,
      size
    }
  })
}

export function deleteList(id) {
  return request({
    url: '/user/delete',
    method: 'delete',
    params: {
      id
    }
  })
}
export function getconut() {
  return request({
    url: '/user/count',
    method: 'get',
    params
  })
}

export function getTextList(searchInfo, current, size) {
  return request({
    url: '/text/list',
    method: 'get',
    params: {
      searchInfo,
      current,
      size
    }
  })
}

export function deleteTextList(id) {
  return request({
    url: '/text/delete',
    method: 'delete',
    params: {
      id
    }
  })
}
export function getTextconut() {
  return request({
    url: '/text/count',
    method: 'get',
    params
  })
}
export function editText(id, status) {
  return request({
    url: '/text/update',
    method: 'POST',
    params: { id, status }
  })
}

export function searchText(id) {
  return request({
    url: 'essearch/get',
    method: 'get',
    params: { id }
  })
}
export function sortText() {
  return request({
    url: 'text/sort',
    method: 'get'
  })
}

export function sortLikeText() {
  return request({
    url: 'text/sortlike',
    method: 'get'
  })
}
