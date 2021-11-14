'use strict'

const oldArrayProto = Array.prototype
const newArrayProto = Object.create(oldArrayProto)

function arrayMethodBorrowing() {
  const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice']
  arrayMethods.forEach((method) => {
    newArrayProto[method] = function(...args) {
      oldArrayProto[method].apply(this, args)
      handler()
    }
  })
}

function handler() {
  console.log(`侦测到数据变化`)
}

function observer(target) {
  if (typeof target !== 'object' || target === null) {
    return
  }

  if (Array.isArray(target)) {
    Object.setPrototypeOf(target, newArrayProto)
  }

  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      defineReactive(target, key, target[key])
      observer(target[key])
    }
  }
}

function defineReactive(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() { 
      return value
    },
    set(newValue) {
      if (newValue !== value) {
        value = newValue
        observer(newValue)
        handler()
      }
    }
  })
}

const user = {
  name: 'xu liang',
  age: 23,
  info: {
    email: '12345@abc.com',
    phone: 13892042912
  },
  friend: ['Luke', 'Frank', 'John']
}

arrayMethodBorrowing()
observer(user)

user.name = 'zhang san'
user.info.email = '8123123@qq.com'
user.friend.push('123')
user.friend.splice(3, 1)
console.log(user.friend)
