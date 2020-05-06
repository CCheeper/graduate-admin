import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getInfo(token,username) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token,username }
  })
}

export function editUser(id,email, phone, sex, underwrite) {
  return request({
    url: '/user/update',
    method: 'put',
    params: {id, email, phone, sex, underwrite }
  })
}

export function setUserToken(username,token) {
  return request({
    url: '/user/settoken',
    method: 'post',
    params:{
      username,token
    }
  })
}


