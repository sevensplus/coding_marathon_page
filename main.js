let url = "https://raw.githubusercontent.com/hexschool/w3hexschool-API/master/data.json"
let sortdata = []
let totaldata = []
let blogList = []

// 接 API 資料
fetch(url)
  .then( res => {
    return res.json();
  })
  .then( data => {
    sortdata = sortByTime(data)
    blogList = collectBlogList(data)
    let max = maxNum(sortdata)
    totaldata = grabTotal(sortdata,max)
    renderAll(0, totaldata)
  })
// 時間單位換算 + 把資料依時間排序
function sortByTime(data){
  for (let i = 0; i< data.length; i++){
    let item = data[i]
    let time = item.updateTime.split(" ");
    let day = time[0].split('/')
    let hour = time[2].split(':')
    if (time[1] == "下午" && hour[2].slice(0,2) !== '12') {
      hour[2] = parseInt(hour[2]) + 12;
    } else if (time[1] == "上午" && hour[2].slice(0,2) == '12') {
      hour[2] = '00';
    }
    data[i].updateTime = new Date(day[0],day[1]-1,day[2],hour[0],hour[1],hour[2])
    data[i].time = `${time[0]}  ${hour.join(':')}`
    data[i].length = data[i].blogList.length - 1
  }
  data.sort((a,b) =>{
    return b.updateTime.getTime() - a.updateTime.getTime()
  })
  return data
}
// 抓文章最大值
function maxNum(data){
  let max = 0
  for (let i = 0;i<data.length;i++){
    if (data[i].blogList.length > max) max = data[i].blogList.length
  }
  return max
}

// 抓全部資料
function grabTotal(data,num){
  let database = []
  console.log(data)
  for(let i = num;i > 0;i --){
    if (i == num) {
      for (let i = 0; i < data.length; i ++){
        let temp = data[i].length
        let item = {
          time:data[i].time,
          url:data[i].blogList[temp].url,
          title:data[i].blogList[temp].title
        }
        database.push(item)
        data[i].length -= 1
      }
    } else {
      for (let i = 0; i < data.length; i ++){
        let temp = data[i].length
        if(temp < 0) continue;
        let item = {
          time:"",
          url:data[i].blogList[temp].url,
          title:data[i].blogList[temp].title
        }
        database.push(item)
        data[i].length -= 1
      }
    }
  }
  return database
}

function clean(){
  $('table').remove()
  $('.page-number-list').remove()
  $('.back2author').remove()
  $('.author-page-number-list').remove()
}

// 渲染列表頁面
function renderAll(a,data){
  clean()
  $('article').append('<table id="archive" class="table table-striped"><thead class="table-wrap"></thead><tbody></tbody></table>')
  $('article').append('<div class="page-number-list"></div>')
  $('.table-wrap').append('<tr class="table-info"><th scope="col" class="article_page_time">時間</th><th scope="col" class="article_page_title">標題</th></tr>')
  let num = a * 15
  for (let i = num; i < Math.min(num + 15, data.length); i += 1){
    let row = $('<tr></tr>')
    row.append(`<td class="article_page_time">${data[i].time}</td>`)
    row.append(`<td class="article_page_title"><a href='${data[i].url}' target="_blank">${data[i].title}</a></td>`)
    $('tbody').append(row)  
  }
  let page_num = Math.ceil(data.length / 15)
  for (let i = 0; i < page_num; i += 1){
    $('.page-number-list').append(`<button id=page_${i} class="article_page btn btn-outline-info">${i+1}</button>`)
  }
}

// 搜尋 + 渲染文章列表
function search(a,data){
  let result = []
  for (let i = 0; i < data.length; i += 1) {
    let item = data[i]
    if (item.title.includes(a)) {
      let obj = {
        title:item.title,
        url:item.url,
        time:item.time
      }
      result.push(obj)
    }
  }
  return result
}
function renderSearch(data){
  clean()
  $('article').append('<table id="archive" class="table table-striped"><thead class="table-wrap"><tbody></tbody></thead></table>')
  $('.table-wrap').append('<tr class="table-info"><td scope="col">時間</td><td scope="col">標題</td></tr>')
  for (let i = 0; i < data.length; i += 1){
    let row = $('<tr></tr>')
    row.append(`<td>${data[i].time}</td>`)
    row.append(`<td><a href='${data[i].url}' target="_blank">${data[i].title}</a></td>`)
    $('tbody').append(row)
  }
}

// 部落格整理
function collectBlogList(data){
  let checklist = []
  let result = []
  for (let i = 0;i < data.length;i += 1){
    let url = data[i].blogUrl
    if(!checklist.includes(url)){
      let obj = {
        url:url,
        name:data[i].name,
        num:data[i].blogList.length
      }
      checklist.push(url)
      result.push(obj)
    }
  }
  return result
}

// 部落格專區
function showBlogList(a,data){
  clean()
  $('article').append('<table id="archive" class="table table-striped"><thead class="table-wrap"><tbody></tbody></thead></table>')
  $('article').append('<div class="author-page-number-list"></div>')
  $('.table-wrap').append('<tr class="table-info"><td scope="col" class="authorpage_author">作者</td><td scope="col" class="authorpage_num">文章數</td><td scope="col">部落格網址</td></tr>')
  for (let i = a*15; i < Math.min(a+15, data.length); i +=1){
    let row = $('<tr></tr>')
    row.append(`<td class="authorpage_author"><a href='${data[i].url}'>${data[i].name}</a></td>`)
    row.append(`<td class="authorpage_num">${data[i].num}</a></td>`)
    row.append(`<td><span class='blog-url'>${data[i].url}</span></td>`)
    $('tbody').append(row)
  }
  let page_num = Math.ceil(data.length / 15)
  for (let i = 0; i < page_num; i += 1){
    $('.author-page-number-list').append(`<button id=authorpage_${i} class="author_page btn btn-outline-info">${i+1}</button>`)
  }
}
// 部落格連到文章內容
function articleByBlog(e){
  let content = e.target.innerText
  let result = []
  for (let i = 0; i < sortdata.length;i += 1) {
    if (content == sortdata[i].blogUrl){
      result = sortdata[i].blogList
      continue;
    }
  }
  clean()
  let archive = $('<table id="archive" class="table table-striped"><thead class="table-wrap"><tbody></tbody</thead></table>')
  $('article').append(archive)
  $('.table-wrap').append('<tr class="table-info"><td scope="col">標題</td></tr>')
  for (let i = 0; i < result.length; i +=1){
    let row = $('<tr></tr>')
    row.append(`<td><a href='${result[i].url}' target="_blank">${result[i].title}</a></td>`)
    $('tbody').append(row)
  }
  $('article').append('<button class="back2author btn btn-outline-info">回作者列表</button>')
}

// 事件監聽
// 回到文章列表
$('.article-list').click(function(){
  renderAll(0,totaldata)
})
// 文章列表換頁
$('article').delegate('.article_page','click',function(e){
  let num = e.target.id.split('_')[1]
  renderAll(num,totaldata)
})
// 搜尋文章標題
$('.search-botton').click(function(){
  let word = $('.search-box').val()
  $('.search-box').val('')
  let final = search(word,totaldata)
  renderSearch(final)
})
// 作者專區
$('.author-list').click(function(){
  showBlogList(0,blogList)
})
// 作者專區連結個人文章
$('article').delegate('.blog-url','click',function(e){
  articleByBlog(e)
})
// 個人文章區回到作者專區
$('article').delegate('.back2author','click',function(){
  showBlogList(0,blogList)
})
// 文章列表換頁
$('article').delegate('.author_page','click',function(e){
  let num = e.target.id.split('_')[1]
  showBlogList(num,blogList)
})
