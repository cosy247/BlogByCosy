const n=`---\r
id: 4\r
date: 2023/10/21\r
title: 可配置的表格Vue组件\r
tags: Vue 前端\r
description: 可配置的表格Vue组件\r
---\r
\r
# 可配置的表格 Vue 组件\r
\r
## 目的\r
\r
实现一个通用的表格\`Vue\`组件，通过对组件的\`prop\`的控制做到对组件内容的更改。【采用[element-ui](https://element.eleme.cn/#/zh-CN/component/installation)作为 ui】\r
\r
## 实现简单的一个 table\r
\r
先对表头和表身的数据分割开来。表头对自身进行描述控制。表身的数据对单元格进行控制。\r
\r
\`\`\`html\r
<template>\r
  <div class="root-table">\r
    <div class="table-content">\r
      <table class="table-content-table" border="0" cellspacing="0">\r
        <tr>\r
          <th v-for="thColumn in ths">{{ thColumn.name }}</th>\r
        </tr>\r
        <tr v-for="tdRow in tds">\r
          <td v-for="tdColumn in tdRow">{{ tdColumn }}</td>\r
        </tr>\r
      </table>\r
    </div>\r
  </div>\r
</template>\r
\r
<script>\r
  export default {\r
    data: () => ({\r
      ths: [\r
        { name: '输入框' },\r
        { name: '下拉框' },\r
        { name: '单选框' },\r
        { name: '日历' },\r
        { name: '开关' },\r
        { name: '附件' },\r
      ],\r
      tds: [\r
        ['XX', '321321', true, '2023/6/2', true, '.doc', ''],\r
        ['XX', '321321', true, '2023/6/2', true, '.doc', ''],\r
        ['XX', '321321', true, '2023/6/2', true, '.doc', ''],\r
        ['XX', '321321', true, '2023/6/2', true, '.doc', ''],\r
        ['XX', '321321', false, '2023/6/2', true, '.doc', ''],\r
        ['XX', '321321', true, '2023/6/2', true, '.doc', ''],\r
        ['XX', '321321', false, '2023/6/2', true, '.doc', ''],\r
      ],\r
    }),\r
  };\r
<\/script>\r
\`\`\`\r
\r
渲染结果：\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-1.png)\r
\r
> \`注：css可以在最后的完整代码中查看\`\r
\r
## 实现输入框单元格\r
\r
目前单元格都是显示的普通文本，需要显示其他的特殊单元格需要添加一个字段\`type\`用来标识需要显示\`input\`类型。而其他的默认为\`text\`类型。\r
\r
\`\`\`html\r
<td v-for="tdColumn in tdRow" :class="getItemClassName(tdColumn)">\r
  <el-input v-if="tdColumn.type == 'input'" v-model="tdColumn.value" />\r
  <span v-else>{{ tdColumn.value }}</span>\r
</td>\r
\`\`\`\r
\r
\`\`\`js\r
// 添加处理后的数据\r
data: () => ({\r
    // ...\r
    thData: [],\r
    tdData: [],\r
}),\r
// 对ths和tds进行处理\r
beforeMount() {\r
    this.thData = this.ths.map((item) => (typeof item == 'object' ? item : { name: item }));\r
    this.tdData = this.tds.map((tdRow) =>\r
        tdRow.map((item, index) => ({\r
            type: 'text', // 默认添加text类型\r
            ...this.thData[index], // 将th的数据添加到td中\r
            ...(typeof item == 'object' ? item : { value: item }), // 将数据替换为object\r
        }))\r
    );\r
},\r
methods: {\r
    getItemClassName(column) {\r
        return {\r
            [column.type] : true\r
        }\r
    }\r
}\r
\`\`\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-2.png)\r
\r
对\`thData\`数据的处理比较简单。对\`tdData\`的处理过程是将对于列的\`th\`的配置内容写入到每一个单元格中，在渲染单元格的时候对其中的配置进行判断然后渲染为不同的单元格。当然也可以直接写到对应的单元格配置中，只是控制的权重不同，默认权重小于\`th\`配置权重小于单元格配置权重。这样方便配置列整体的单元格，也方便对单一单元格的配置进行特殊处理。进行处理后得到的\`thData\`为一个二维数组：\`[[{type, name, value}]]\`，其中\`name\`为列名来着表头，主要用于后面封装时的回调传值。添加\`getItemClassName\`方法用来设置单元格的类名，方便对单元格样式的控制。\r
\r
> 表格直接显示输入框显然不符合大多数的业务场景，更多的场景是默认显示普通文本信息，在每一列有编辑按钮，在点击编辑后讲对于的单元格切换为输入框。\r
\r
## 添加特殊功能按钮\r
\r
编辑按钮可以看作为一个特殊的控制功能，他需要对表格的其他单元格进行控制，之后还有保存，删除等。我们将这些可以改变其他单元格的功能统一使用\`option\`这一种\`type\`来做区分，再使用\`option\`属性用来表示操作的类型。\r
\r
\`\`\`js\r
data: () => ({\r
    ths: [\r
        { name: '输入框', type: 'input' },\r
        { name: '下拉框' },\r
        { name: '单选框' },\r
        { name: '日历' },\r
        { name: '开关' },\r
        { name: '附件' },\r
        { name: '操作', type: 'option', option: '|edit|delete'}\r
    ],\r
    tds: [\r
        ['XX', '321321', true, '2023/6/2', true, '.doc', ''],\r
        ['XX', '321321', true, '2023/6/2', true, '.doc', ''],\r
        ['XX', '321321', true, '2023/6/2', true, '.doc', ''],\r
        ['XX', '321321', true, '2023/6/2', true, '.doc', ''],\r
        ['XX', '321321', false, '2023/6/2', true, '.doc', ''],\r
        ['XX', '321321', true, '2023/6/2', true, '.doc', ''],\r
        ['XX', '321321', false, '2023/6/2', true, '.doc', ''],\r
    ],\r
    // ...\r
}),\r
\`\`\`\r
\r
\`\`\`html\r
<tr v-for="(tdRow, rowIndex) in tdData">\r
  <td v-for="tdColumn in tdRow" :class="getItemClassName(tdColumn)">\r
    <div v-if="tdColumn.type == 'option'">\r
      <span v-if="tdColumn.option.includes('|edit')" @click="editRow(tdRow, rowIndex)">编辑</span>\r
      <span v-if="tdColumn.option.includes('|delete')" @click="deleteRow(tdRow, rowIndex)">删除</span>\r
      <span v-if="tdColumn.option.includes('|save')" @click="saveRow(tdRow, rowIndex)">保存</span>\r
      <span v-if="tdColumn.option.includes('|cancel')" @click="cancelRow(tdRow, rowIndex)">取消</span>\r
    </div>\r
    <!-- ... -->\r
  </td>\r
</tr>\r
\`\`\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-4.png)\r
\r
编辑按钮用了一个\`div\`包含起来是为了方便对\`option\`的显示进行统一管理。使用\`includes\`来判断是否添加按钮，这样方便一个操作栏中同时配置多个功能按钮。\r
\r
> 这里只用竖线对名称进行分割，用于避免一个操作为\`A\`，一个操作为\`B\`，一个操作为\`AB\`，无法有效的区分出是\`AB\`还是\`A&B\`的情况。当然也可以使用数组代替 option 的值。\r
\r
## 编辑功能\r
\r
目前单元格的显示是由单元格的配置决定的，那么在出发特殊按钮时对单元格的配置进行修改即可。添加一个 edit 属性，用于表示编辑时单元格的配置信息。配置不是直接替换，而是使用覆盖的方式，这样单元格之前的部分属性可以得到保留，比如 value。\r
\r
\`\`\`html\r
<div v-if="tdColumn.type == 'option'">\r
  <span v-if="tdColumn.option.includes('|edit')" @click="editRow(tdRow, rowIndex)">编辑</span>\r
  <span v-if="tdColumn.option.includes('|delete')" @click="deleteRow(tdRow, rowIndex)">删除</span>\r
  <span v-if="tdColumn.option.includes('|save')" @click="saveRow(tdRow, rowIndex)">保存</span>\r
  <span v-if="tdColumn.option.includes('|cancel')" @click="cancelRow(tdRow, rowIndex)">取消</span>\r
</div>\r
\`\`\`\r
\r
\`\`\`js\r
data: () => ({\r
    ths: [\r
        { name: '输入框', edit: { type: 'input' } },\r
        { name: '下拉框' }, { name: '单选框' },\r
        { name: '日历' }, { name: '开关' },\r
        { name: '附件' },\r
        { name: '操作', type: 'option', option: '|edit|delete', edit: { option: '|save|cancel' } }],\r
    // ...\r
}),\r
\`\`\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-5.png) ![Alt text](./assets/ConfigurableTableVueComponent/image-6.png)\r
\r
其中输入框的\`type\`默认为\`text\`可以不写，操作的\`type\`为\`option\`，在编辑时\`type\`不变而把\`option\`改为保存和取消。在编辑事件中我们只需要把 edit 中的配置释放到外层配置即可。\r
\r
\`\`\`js\r
methods: {\r
    editRow(rowData, rowIndex) {\r
        this.$set(this.tdData, rowIndex, rowData.map((item, index) => {\r
                return {\r
                    ...item,\r
                    ...item.edit,\r
                };\r
            })\r
        );\r
    },\r
    // ...\r
}\r
\`\`\`\r
\r
这里对操作行的配置进行统一的修改，将 edit 的内容覆盖追加到配置中，渲染出新的单元格。\r
\r
## 取消编辑功能\r
\r
在编辑时，输入框绑定的是单元格的\`value\`值，那么在取消的时候我们需要对\`option\`还原的同时还需要对\`value\`值进行还原。这里需要还原两个属性，但是之后的功能中可能还会有对样式的还原，对类名的还原等，所以不采用手动判断数据的方式去还原数据，而是使用保存初始化信息的方式。在最开始生成单元格配置信息时先对配置信息进行复制一份保存起来，在复原时直接替换对应列的配置即可。\r
\r
\`\`\`js\r
data: () => ({\r
    // ...\r
    tdInitData: [],\r
}),\r
beforeMount() {\r
    // ...\r
    this.tdData = // ...\r
    this.tdInitData = structuredClone(this.tdData);\r
},\r
methods: {\r
    cancelRow(rowData, rowIndex) {\r
        this.$set(this.tdData, rowIndex, structuredClone(this.tdInitData[rowIndex]));\r
    },\r
    // ...\r
}\r
\`\`\`\r
\r
> structuredClone：js 提供的结构化数据深拷贝工具函数 [MDN-structuredClone](https://developer.mozilla.org/zh-CN/docs/web/api/structuredClone)\r
\r
## 保存功能\r
\r
保存功能和取消功能类似，都需要对配置还原，只是需要对\`value\`进行保存。同时把\`tdInitData\`的\`value\`也更新掉。\r
\r
\`\`\`js\r
methods: {\r
    saveRow(rowData, rowIndex) {\r
        this.tdInitData[rowIndex].forEach((item, index) => {\r
            item.value = rowData[index].value;\r
        });\r
        this.$set(this.tdData, rowIndex, structuredClone(this.tdInitData[rowIndex]));\r
    },\r
}\r
\`\`\`\r
\r
## 删除功能\r
\r
删除功能就更加简单了，只要把对应行的数据删除即可。同时把\`tdInitData\`的对应行也删除。\r
\r
\`\`\`js\r
\r
methods: {\r
    deleteRow(rowData, rowIndex) {\r
        this.tdData.splice(rowIndex, 1);\r
        this.tdInitData.splice(rowIndex, 1);\r
    },\r
    // ...\r
}\r
\`\`\`\r
\r
### 小结\r
\r
目前已经对单元格的编辑相关功能已经完成，大致思想就是对单元格的配置进行修改以渲染出不同的单元格。当目前属性不足以完成目标功能时对属性进行添加，来保存需要的新属性即可。\r
\r
### 添加更多的特殊单元格\r
\r
对应单元格的渲染类型我们使用 type 来控制，目前有默认的 text 和特殊的 input、option。通过添加更多的 type 来区分特殊单元格的类型，并使用 value 进行值保存，在必要时添加更多的属性。\r
\r
### 添加下拉框\r
\r
这里使用\`select\`作为\`type\`的值，并使用\`element-ui\`提供的[el-cascader](https://element-plus.org/zh-CN/component/cascader.html)进行渲染，使用\`el-cascader\`是为了同时兼容多级选择器。并定义一个\`typeData\`来保存下拉框的数据。\r
\r
\`\`\`html\r
<td v-for="tdColumn in tdRow" :class="getItemClassName(tdColumn)">\r
  <!-- ... -->\r
  <el-cascader v-else-if="tdColumn.type == 'select'" :options="tdColumn.typeData" v-model="tdColumn.value" />\r
  <!-- ... -->\r
</td>\r
\`\`\`\r
\r
\`\`\`js\r
data: () => ({\r
  tableData: {\r
    ths: [\r
      {\r
        name: '下拉框',\r
        edit: {\r
          type: 'select',\r
          typeData: [\r
            {\r
              value: 22,\r
              tag: 222,\r
              children: [\r
                { value: 22, tag: 222 },\r
                { value: 33, tag: 333 },\r
              ],\r
            },\r
            { value: 33, tag: 333 },\r
          ],\r
        },\r
      },\r
      // ...\r
    ],\r
  },\r
  // ...\r
});\r
\`\`\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-7.png) ![Alt text](./assets/ConfigurableTableVueComponent/image-8.png)\r
\r
可以看到编辑是没有默认的值，是因为我们的 value 没有存在在数据中。但是保存后的 value 是一个数组，直接显示显然不满足我们的期望，那么需要我们对显示的数据进行类型判断来显示合适的。\r
\r
#### 对文本单元格更新\r
\r
如果是对类型进行判断显示的话可能还是有些问题。比如刚刚的多级选择框，最后的的值是一个数组，那是显示最后一个值（多级的子选择没有冲突）还是全部显示（多级的子选择有冲突）呢？这显然只判断数据类型不能做到，而是需要添加一个新的属性来规定文本的显示类型。\r
\r
\`\`\`html\r
<span v-else class="text">{{ getShowText(tdColumn) }}</span>\r
\`\`\`\r
\r
\`\`\`js\r
data: () => ({\r
    tableData: {\r
        ths: [\r
            {\r
                name: '下拉框',\r
                showType: 'array-end',\r
                // ...\r
            },\r
        // ...\r
        ]\r
    }\r
})\r
methods: {\r
    getShowText({ showType, value }) {\r
        if (Object.prototype.toString.call(value) == '[object Array]') {\r
            if (showType == 'array-end') {\r
                return this.getShowText({ value: value.at(-1) });\r
            } else {\r
                return value.map(item => this.getShowText({value: item})).join('-')\r
            }\r
        } else if (Object.prototype.toString.call(value) == '[object Date]') {\r
            return value.toLocaleDateString();\r
        } else {\r
            return value;\r
        }\r
    },\r
}\r
\`\`\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-9.png)\r
\r
将 showType 设置为其他值时将用横线进行分割\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-10.png)\r
\r
在获取显示文本时还是需要做一次数据类型的判断避免配置错误发生的 bug。在知道是数组时获取到数据后还需要再对其中的数据进行递归一次。再这个问题中可以不采用递归，但是数组中可以为\`Date\`类型，那么需要进行进一步的处理，在下面的事件选择器中将会遇到这个问题，但是我们已经提前解决了。\r
\r
## 添加时间选择器\r
\r
和添加下拉框类似，创建一个新的 type 来表示时间选择器。这里使用[el-date-picker](https://element-plus.org/zh-CN/component/date-picker.html)进行渲染。\r
\r
\`\`\`html\r
<el-date-picker v-else-if="tdColumn.type == 'date'" v-model="tdColumn.value" :type="tdColumn.dateType" format="yyyy/M/d" />\r
\`\`\`\r
\r
\`\`\`js\r
data: () => ({\r
  tableData: {\r
    ths: [\r
      { name: '日历', edit: { type: 'date', dateType: 'date' } },\r
      // ...\r
    ],\r
  },\r
});\r
\`\`\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-11.png)\r
\r
\`el-date-picker\` 中有个\`type\`属性表示选择器类型，我们这里使用\`dateType\`表示。\`dateType\`可以不写在\`edit\`中，因为只有在\`type\`为\`date\`是\`dateType\`还有作用。这里选择后的值为\`Date\`类型，之前在\`getShowText\`已经对它处理掉了。\r
\r
> \`el-date-picker\`组件根据类型的不一样可以选择单一时间，也可以选择一个时间段。选择单一事件时的\`value\`为\`Date\`类型，选择事件段时的\`value\`为数组\`[Date, Date]\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-12.png)\r
\r
## 添加单选框\r
\r
单选框有点特殊，因为在编辑和没有编辑时它都应该显示单选框的样式，也就是\`type\`不变只改变是否可点击。这里添加\`diabeld\`属性对其控制。\r
\r
\`\`\`html\r
<td v-for="tdColumn in tdRow" :class="getItemClassName(tdColumn)">\r
  <!-- ... -->\r
  <el-checkbox v-else-if="tdColumn.type == 'checkbox'" v-model="tdColumn.value" :disabled="tdColumn.disabled" />\r
  <el-switch v-else-if="tdColumn.type == 'switch'" v-model="tdColumn.value" :disabled="tdColumn.disabled" />\r
  <!-- ... -->\r
</td>\r
\`\`\`\r
\r
\`\`\`js\r
data: () => ({\r
  tableData: {\r
    ths: [\r
      // ...\r
      { name: '单选框', type: 'checkbox', disabled: true, edit: { disabled: false } },\r
      { name: '开关', type: 'switch', disabled: true, edit: { disabled: false } },\r
    ],\r
  },\r
});\r
\`\`\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-13.png)\r
\r
> 这里只是给单选框和开关添加了 disabled 属性，当然也可以给其他类型的单元格添加这个属性进行统一管理。\r
\r
## 小结\r
\r
单元格的类型是由\`type\`决定的，通过添加\`type\`类型来添加特殊单元格，再在对应的地方添加上组件即可。在需要更多控制属性时添加额外的属性保存其信息。\r
\r
## 添加列功能\r
\r
添加功能可以作为一个特殊功能，因为它也相当于在改变单元格的状态。添加按钮应该不在表格中的已经存在的某一列中，而是单独成一行或者由单独的位置。\r
\r
\`\`\`html\r
<div class="root-table">\r
  <!-- ... -->\r
  <div v-if="config.addible && !isAdding" class="table-add">\r
    <p @click="addRow">新增</p>\r
  </div>\r
</div>\r
\`\`\`\r
\r
\`\`\`js\r
data: () => ({\r
    config: {\r
        addible: true,\r
    },\r
    isEditing: false,\r
    isAdding: false,\r
    // ...\r
}),\r
beforeMount() {\r
    // ...\r
    this.addRowData = structuredClone(this.tdData[0]).map((item) => {\r
        item.value = '';\r
        return item;\r
    });\r
},\r
methods: {\r
    // ...\r
    editRow(rowData, rowIndex) {\r
        if(this.isEditing) return;\r
        // ...\r
    },\r
    saveRow(rowData, rowIndex) {\r
        this.isEditing = false;\r
        if (this.isAdding && rowIndex == this.tdData.length - 1) {\r
            this.isAdding = false;\r
        }\r
        this.tdInitData[rowIndex].forEach((item, index) => {\r
            item.value = rowData[index].value;\r
        });\r
        this.$set(this.tdData, rowIndex, structuredClone(this.tdInitData[rowIndex]));\r
    },\r
    cancelRow(rowData, rowIndex) {\r
        this.isEditing = false;\r
        if (this.isAdding) {\r
            this.tdData.pop();\r
            this.tdInitData.pop();\r
            this.isAdding = false;\r
        } else {\r
            this.$set(this.tdData, rowIndex, structuredClone(this.tdInitData[rowIndex]));\r
        }\r
    },\r
    addRow() {\r
        if(this.isEditing) return;\r
        this.isAdding = true;\r
        this.tdData.push(structuredClone(this.addRowData));\r
        this.tdInitData.push(structuredClone(this.addRowData));\r
        const index = this.tdData.length - 1;\r
        this.editRow(this.tdData[index], index);\r
    },\r
},\r
\`\`\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-14.png)\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-15.png)\r
\r
表格是否添加是针对于表格而言的，所以可以添加的判断属性应该不在\`tdData \`或者\`thData\`中，这里声名了一个\`config\`用来对表格的整体描述，用于展示或者隐藏添加按钮。添加一列就是在\`tdData\`中添加数据，在\`beforeMount\`中生成添加列的模板，在添加时在数据末尾添加一个模板的复制即可。需要注意的是\`tdInitData\`也需要添加模板数据，并自动使其处于编辑状态。这里使用\`isAdding\`属性标识了目前是否在添加，避免多次点击出现多个添加框，并在保存和取消时对\`isAdding\`进行释放。使用\`isEditing\`属性表示是否有列在编辑，避免多行数据共同编辑，并在保存和取消时释放。\r
\r
## 属性必填功能\r
\r
在编辑时可以有的属性是必须填写的，其样式应该和其他的做区分，在保存时应该判断其是否填写。在单元格的中添加一个 require 表示是否必填。\r
\r
\`\`\`js\r
function isEmptyValue(value) {\r
  if (Object.prototype.toString.call(value) == '[object Array]') {\r
    return value.length !== 0;\r
  } else if (Object.prototype.toString.call(value) == '[object Object]') {\r
    return Object.keys(value).length !== 0;\r
  } else if (Object.prototype.toString.call(value) == '[object String]') {\r
    return value.length !== 0;\r
  } else if (value === true || value === false) {\r
    return true;\r
  } else {\r
    return false;\r
  }\r
}\r
\`\`\`\r
\r
\`\`\`js\r
data: () => ({\r
    ths: [\r
        { name: '输入框',  edit: { type: 'input', require: true } },\r
        // ...\r
    ],\r
    // ...\r
})\r
methods: {\r
    getItemClassName(column) {\r
        return {\r
            [column.type || 'text']: true,\r
            require: column.require,\r
        };\r
    },\r
    getItemClassName(column) {\r
        return {\r
            [column.type || 'text']: true,\r
            require: column.require,\r
            stickyLeft: column.position && column.position.includes('left'),\r
            stickyRight: column.position && column.position.includes('right'),\r
            search: column.type == 'text' && String(column.value).includes(this.config.search),\r
        };\r
    },\r
    saveRow(rowData, rowIndex) {\r
        const checkRequire = rowData.some((item) => {\r
            console.log(item.require, item.value);\r
            return item.require && !isEmptyValue(item.value);\r
        });\r
        if (checkRequire) {\r
            this.$message.warning('请填写必要字段');\r
            return;\r
        }\r
        // ...\r
    },\r
    // ...\r
}\r
\`\`\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-16.png)\r
\r
在 getItemClassName 中判断 require 值为单元格添加类名，并编写 css（这里没有写出 css）。在保存时判断是否有必填的单元格没有填写，并在没有完全填写时提示用户。这里判断是否填写单元格单独写了个函数，可以提供给其他地方使用，根据项目的不同可以对函数进行调整。\r
\r
## 搜索功能\r
\r
搜索功能核心也是给符合条件的单元格添加样式，这里只对类型为 text 的进行搜索处理。搜索也是对表格整体的改变，搜索的关键词也放在 config 中。\r
\r
\`\`\`js\r
data: () => ({\r
    config: {\r
        search: 'ABC',\r
        // ...\r
    },\r
}),\r
methods: {\r
    getItemClassName(column) {\r
        return {\r
            // ...\r
            search: column.type == 'text' && String(column.value).includes(this.config.search),\r
        };\r
    },\r
    // ...\r
}\r
\`\`\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-18.png)\r
\r
## 对单一单元格进行控制\r
\r
## 在数据中修改单元格配置\r
\r
在对单元格预处理时，单元格配置的\`type\`默认为\`text\`，然后继承\`td\`的配置，最后用只身的配置进行覆盖。那么只修改目标单元格的配置即可实现对单一单元格的控制。\r
\r
\`\`\`js\r
data: () => ({\r
  // ...\r
  tds: [\r
    [{ value: true, type: 'switch' }, '321321', true, '2024/6/2', true, '.doc', ''],\r
    // ...\r
  ],\r
});\r
\`\`\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-25.png)\r
\r
## 通过筛选修改单元格配置\r
\r
在业务中，可能出现两个字段比如时间和地点，在时间未到时可能修改时间，过时后将不可以修改。通过筛选对符合条件的单元格进行控制修改。这里使用日历为时间，使用\`disabled\`控制是否可以写，在时间过时后设置为不可写。\r
\r
\`\`\`js\r
data: () => ({\r
    config: {\r
        // ...\r
        setItemConfig(itemConfig, tdRow, rowIndex) {\r
            if (new Date(tdRow[3].value) > Date.now()) {\r
                itemConfig.disabled = true;\r
                itemConfig.edit = {\r
                    ...itemConfig.edit,\r
                    disabled: true,\r
                };\r
            }\r
        },\r
    },\r
    // ...\r
}),\r
beforeMount() {\r
    this.thData = this.ths.map((item) => (typeof item == 'object' ? item : { name: item }));\r
    this.tdData = this.tds.map((tdRow, rowIndex) =>\r
        tdRow.map((item, index) => ({\r
            type: 'text',\r
            ...this.thData[index],\r
            ...(typeof item == 'object' ? item : { value: item }),\r
        }))\r
    );\r
    if (typeof this.config?.setItemConfig == 'function') {\r
        this.tdData.forEach((tdRow, rowIndex) =>\r
            tdRow.forEach((itemConfig) => {\r
                this.config.setItemConfig(itemConfig, tdRow, rowIndex);\r
            })\r
        );\r
    }\r
    this.tdInitData = structuredClone(this.tdData);\r
    this.addRowData = structuredClone(this.tdData[0]).map((item) => {\r
        item.value = '';\r
        return item;\r
    });\r
},\r
\`\`\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-24.png)\r
\r
在\`config\`中定义\`setItemConfig\`函数用户修改单元格的配置，参数为当前作用目标单元格配置，这一行单元格的配置，这一行的下标。\r
\r
## Props 传递与数据更新\r
\r
## Props 传递\r
\r
在次之前都是在组件内定义的数据并渲染，这显然不符合组件的使用形式。其中\`tds\`，\`ths\`，\`config\`可以转为\`props\`传递。其中\`tds\`和\`ths\`可以合并为\`tdData\`。将当前表格组件命名为\`Table.vue\`，父级组件命名为\`TableDome.vue\`\r
\r
\`\`\`html\r
<!--TableDome.vue -->\r
<template>\r
  <div class="tableDome-root">\r
    <table :data="tableData" :config="tableConfig" />\r
  </div>\r
</template>\r
\r
<script>\r
  // import 引入Table组件;\r
\r
  export default {\r
    components: { Table },\r
    data: () => ({\r
      tableData: {\r
        ths: [\r
          // ...\r
        ],\r
        tds: [\r
          // ...\r
        ],\r
      },\r
      tableConfig: {\r
        // ...\r
      },\r
    }),\r
  };\r
<\/script>\r
\`\`\`\r
\r
\`\`\`js\r
// Table.vue\r
props: {\r
    data: Object,\r
    config: Object,\r
},\r
data: () => ({\r
    isEditing: false,\r
    isAdding: false,\r
    thData: [],\r
    tdData: [],\r
    tdInitData: [],\r
}),\r
\`\`\`\r
\r
> 这样虽然使用了\`props\`传递参数，但是我们修改\`TableDome\`中的数据时表格并不会变化，这是因为表格渲染时没有直接使用\`props\`中的数据，而是在\`beforeMount\`中生成了自己需要的数据。\r
\r
## 数据更新\r
\r
定义一个\`props\`属性\`updateTime\`用来监听是否需要重新生成表格的数据。在\`TableDome\`中修改\`data\`后同时修改\`updateTime\`来告诉\`Table\`需要更新。推荐使用\`Date.now()\`获取时间戳作为\`update\`的值。\r
\r
\`\`\`js\r
props: {\r
    data: Object,\r
    config: Object,\r
    updateTime: Number\r
},\r
// 删除 beforeMount,\r
watch: {\r
    updateTime: {\r
        handler() {\r
            // 复制 beforeMount\r
        },\r
        immediate: true,\r
    }\r
},\r
\`\`\`\r
\r
## 事件回调\r
\r
## 整体数据回调\r
\r
在对数据进行修改，添加，删除等存在时往往伴随着接口的调用对数据进行更新。比如保存回调，可以在\`config\`中定义\`onSave\`为保存回调，并在保存功能触发时调用即可。\r
\r
\`\`\`js\r
data: () => ({\r
    config: {\r
        onSave(rowData, rowIndex, tdValues, vm){\r
            if(rowIndex != 0) {\r
                vm.$message.warning('只可以对第一行数据进行保存')\r
                return false;\r
            }\r
            return true;\r
        },\r
        // ...\r
    }\r
    // ...\r
}),\r
computed: {\r
    tdValues() {\r
        return this.tdData.map((row) => row.map(({ value }, index) => ({ name: this.thData[index].name, value })));\r
    },\r
},\r
methods: {\r
    saveRow(rowData, rowIndex) {\r
        // ...\r
        // 判断是否有保存回调函数，返回为true时继续执行\r
        if(typeof this.config?.onSave == 'function') {\r
            if(!this.config.onSave(rowData, rowIndex, this.tdValues, this)) {\r
                return;\r
            }\r
        }\r
        this.$set(this.tdData, rowIndex, structuredClone(this.tdInitData[rowIndex]));\r
    },\r
}\r
\`\`\`\r
\r
![Alt text](./assets/ConfigurableTableVueComponent/image-26.png)\r
\r
定义计算属性\`tdValues\`表示表格数据集并将当前组件作为参数传入回调。这里一共传递了 4 个参数，也后续开发中可能会传递更多的属性值，需要根据实际情况更改。\r
\r
## 单元格事件回调\r
\r
在一些特殊的情况下，需要对特殊的单元格进行事件绑定。而且不同的组件支持的事件也有所不同。比如输入框支持\`change\`、\`input\`、\`blur\`和\`focus\`，而\`checkbox\`只支持\`change\`就可以了。再定义\`events\`对象为单元格属性，其中包含需要绑定的事件和函数或函数名。\r
\r
\`\`\`html\r
<td v-for="tdColumn in tdRow" :class="getItemClassName(tdColumn)">\r
  // ...\r
  <el-input\r
    v-else-if="tdColumn.type == 'input'"\r
    v-model="tdColumn.value"\r
    :disabled="tdColumn.disabled"\r
    @blur="runEvent('blur', tdColumn, rowIndex)"\r
    @focus="runEvent('focus', tdColumn, rowIndex)"\r
    @input="runEvent('input', tdColumn, rowIndex)"\r
    @change="runEvent('change', tdColumn, rowIndex)" />\r
  // ...\r
</td>\r
\`\`\`\r
\r
\`\`\`js\r
data: () => ({\r
    tableData: {\r
        ths: [\r
            {\r
                // ...\r
                events: {\r
                    change(tdColumn, rowIndex, vm) {},\r
                },\r
            },\r
            // ...\r
        ]\r
        // ...\r
    }\r
    // ...\r
})\r
methods: {\r
    runEvent(eventName, tdColumn, rowIndex) {\r
        if (tdColumn.events) {\r
            if (typeof tdColumn.events[eventName] == 'function') {\r
                tdColumn.events[eventName](tdColumn, rowIndex, this);\r
            } else if (typeof tdColumn.events[eventName] == 'string') {\r
                functionTotal[tdColumn.events[eventName]] && functionTotal[tdColumn.events[eventName]](tdColumn, rowIndex, this);\r
            }\r
        }\r
    },\r
    // ...\r
}\r
\`\`\`\r
\r
现在标签中定义出支持的事件，这里实例给出了\`input\`的事件，其他类型单元格类似。事件都通过\`runEvent\`处理，先查看单元格的\`events\`下是否有对应的事件函数可以调用，再到统一定义函数集合\`functionTotal\`中查找，这里省略了引入。\r
\r
> 事件指定的可以是一个函数，也可以是一个在统一定义函数集合中的一个函数名。统一定义函数集合用来管理一些特殊的函数集合。\r
\r
## 参数说明\r
\r
目前组件有三个参数：\`updateTime\`用于控制数据更新，\`tableData\`用于控制数据展示，\`config\`用于控制表格的整体修改。\r
\r
## updateTime\r
\r
表格数据更新标识，在父组件数据更新后需要改变\`updateTime\`来让\`Tabel\`组件进行更新；推荐使用时间戳。\r
\r
## data\r
\r
\`data\`为表格的数据展示配置，其中分为\`ths\`和\`tds\`分别控制表头和表身。\r
\r
\`\`\`js\r
data = {\r
    ths: [\r
        {\r
            /** 列名 */\r
            name: '下拉框',\r
            /** 单元格类型，默认为text文本类型 */\r
            type: 'select',\r
            /** text文本显示类型 */\r
            showType: 'array-all',\r
            /** 复杂单元格的数据，比如保存下拉框中的数据 */\r
            typeData: any,\r
            /** 单元格是否可用 */\r
            disabled: true,\r
            /** 是否必填，在保存时将会判断 */\r
            require: true，\r
            /** option类型的值，竖线开头（|edit|delete|save|cancel） */\r
            option: '|edit|delete'，\r
            /** 编辑时替换的属性 */\r
            edit: {},\r
            /** 绑定事件 */\r
            events: {\r
                /** 定义change事件并传入执行函数（当前单元格配置，行序号，组件实例） */\r
                change(tdColumn, rowIndex, vm) {},\r
                /** 定义input事件并传入函数名（当前单元格配置，行序号，组件实例） */\r
                input: 'functionName',\r
            }\r
        },\r
    ],\r
    tds: [\r
        [\r
            /** 使用普通类型作为value将会转化为：{value: '321321', type: 'text'} */\r
            '321321',\r
            /** type默认为text：{value: 'XX', type: 'text'} */\r
            { value: 'XX'},\r
            /** 对当前单元格控制为不可用 */\r
            { value: '2023/6/2', disabled: false },\r
        ],\r
    ],\r
}\r
\`\`\`\r
\r
tds 中的单元格配置将默认继承同一列的 ths 配置，例如第三个继承后：\r
\r
\`\`\`js\r
td = {\r
    name: '下拉框',\r
    type: 'select',\r
    value: '2023/6/2',\r
    showType: 'array-all',\r
    typeData: any,\r
    disabled: false,\r
    require: true，\r
    option: '|edit|delete'，\r
    edit: {},\r
}\r
\`\`\`\r
\r
## config\r
\r
cofnig 中为表格的整体配置，通常是一些特殊处理\r
\r
\`\`\`js\r
config = {\r
    /** 是否显示新增按钮 */\r
    addible: true,\r
    /** 搜索关键词 */\r
    search: 'ABC',\r
    /**\r
     * @description: 保存回调\r
     * @param {Array} rowData: 当前行value值\r
     * @param {Number} rowIndex: 行序号\r
     * @param {Array} tdValues: 表格全部value值\r
     * @param {Vue} vm: 表格实例\r
     * @return {boolean} : 返回true表示可以保存\r
     */\r
    onSave(rowData, rowIndex, tdValues, vm){},\r
    /**\r
     * @description: 修改参数itemConfig控制每个单元格\r
     * @param {itemConfig} : 当前单元格格式化配置\r
     * @param {tdRow} : 行数据格式化配置\r
     * @param {rowIndex} : 行序号\r
     * @param {vm} : 表格实例\r
     */\r
    setItemConfig(itemConfig, tdRow, rowIndex, vm) {},\r
},\r
\`\`\`\r
\r
## 总结\r
\r
对表格的改变可以分为对单元格的改变和对表格整体的改变。如果是对单元格的改变只需要对单元格的配置信息进行修改即可，对表格整体的改变则需要在 config 中添加对应的控制属性并在合适的时候添加或者修改组件的标签属性内容。\r
\r
## 完整代码\r
\r
> 需要先引入 element-ui 使用\`/deep/\`对\`element-ui\`组件内部样式进行修改。\r
\r
\`\`\`html\r
<!-- Table.vue -->\r
<template>\r
  <div class="root-table">\r
    <div class="table-content">\r
      <table class="table-content-table" border="0" cellspacing="0">\r
        <tr>\r
          <th v-for="thColumn in thData">{{ thColumn.name }}</th>\r
        </tr>\r
        <tr v-for="(tdRow, rowIndex) in tdData">\r
          <td v-for="tdColumn in tdRow" :class="getItemClassName(tdColumn)">\r
            <div v-if="tdColumn.type == 'option'">\r
              <span v-if="tdColumn.option.includes('|edit')" @click="editRow(tdRow, rowIndex)">编辑</span>\r
              <span v-if="tdColumn.option.includes('|delete')" @click="deleteRow(tdRow, rowIndex)">删除</span>\r
              <span v-if="tdColumn.option.includes('|save')" @click="saveRow(tdRow, rowIndex)">保存</span>\r
              <span v-if="tdColumn.option.includes('|cancel')" @click="cancelRow(tdRow, rowIndex)">取消</span>\r
            </div>\r
            <el-input\r
              v-else-if="tdColumn.type == 'input'"\r
              v-model="tdColumn.value"\r
              :disabled="tdColumn.disabled"\r
              @blur="runEvent('blur', tdColumn, rowIndex)"\r
              @focus="runEvent('focus', tdColumn, rowIndex)"\r
              @input="runEvent('input', tdColumn, rowIndex)"\r
              @change="runEvent('change', tdColumn, rowIndex)" />\r
            <el-date-picker\r
              v-else-if="tdColumn.type == 'date'"\r
              v-model="tdColumn.value"\r
              :type="tdColumn.dateType"\r
              format="yyyy/M/d"\r
              :disabled="tdColumn.disabled"\r
              @blur="runEvent('blur', tdColumn, rowIndex)"\r
              @focus="runEvent('focus', tdColumn, rowIndex)"\r
              @change="runEvent('change', tdColumn, rowIndex)" />\r
            <el-cascader\r
              v-else-if="tdColumn.type == 'select'"\r
              :options="tdColumn.typeData"\r
              v-model="tdColumn.value"\r
              :disabled="tdColumn.disabled"\r
              @blur="runEvent('blur', tdColumn, rowIndex)"\r
              @focus="runEvent('focus', tdColumn, rowIndex)"\r
              @change="runEvent('change', tdColumn, rowIndex)" />\r
            <el-checkbox\r
              v-else-if="tdColumn.type == 'checkbox'"\r
              v-model="tdColumn.value"\r
              :disabled="tdColumn.disabled"\r
              @change="runEvent('change', tdColumn, rowIndex)" />\r
            <el-switch\r
              v-else-if="tdColumn.type == 'switch'"\r
              v-model="tdColumn.value"\r
              :disabled="tdColumn.disabled"\r
              @change="runEvent('change', tdColumn, rowIndex)" />\r
            <span v-else class="text">{{ getShowText(tdColumn) }}</span>\r
          </td>\r
        </tr>\r
      </table>\r
    </div>\r
    <div v-if="config.addible && !isAdding" class="table-add">\r
      <p @click="addRow">新增</p>\r
    </div>\r
  </div>\r
</template>\r
\r
<script>\r
  import { deepClone } from '@/common/utils/public';\r
  import functionTotal from '@/special/out';\r
\r
  function isEmptyValue(value) {\r
    if (Object.prototype.toString.call(value) == '[object Array]') {\r
      return value.length !== 0;\r
    } else if (Object.prototype.toString.call(value) == '[object Object]') {\r
      return Object.keys(value).length !== 0;\r
    } else if (Object.prototype.toString.call(value) == '[object String]') {\r
      return value.length !== 0;\r
    } else if (value === true || value === false) {\r
      return true;\r
    } else {\r
      return false;\r
    }\r
  }\r
\r
  export default {\r
    props: {\r
      data: Object,\r
      config: Object,\r
      updateTime: Number,\r
    },\r
    data: () => ({\r
      isEditing: false,\r
      isAdding: false,\r
      thData: [],\r
      tdData: [],\r
      tdInitData: [],\r
    }),\r
    beforeMount() {},\r
    computed: {\r
      tdValues() {\r
        return this.tdData.map((row) => row.map(({ value }, index) => ({ name: this.thData[index].name, value })));\r
      },\r
    },\r
    watch: {\r
      updateTime: {\r
        handler() {\r
          this.thData = this.data.ths.map((item) => (typeof item == 'object' ? item : { name: item }));\r
          this.tdData = this.data.tds.map((tdRow, rowIndex) =>\r
            tdRow.map((item, index) => ({\r
              type: 'text',\r
              ...this.thData[index],\r
              ...(typeof item == 'object' ? item : { value: item }),\r
            }))\r
          );\r
          if (typeof this.config?.setItemConfig == 'function') {\r
            this.tdData.forEach((tdRow, rowIndex) =>\r
              tdRow.forEach((itemConfig) => {\r
                this.config.setItemConfig(itemConfig, tdRow, rowIndex);\r
              })\r
            );\r
          }\r
          this.tdInitData = deepClone(this.tdData);\r
          if (this.tdData[0]) {\r
            this.addRowData = deepClone(this.tdData[0]).map((item) => {\r
              item.value = '';\r
              return item;\r
            });\r
          }\r
        },\r
        immediate: true,\r
      },\r
    },\r
    methods: {\r
      getShowText({ showType, value }) {\r
        if (Object.prototype.toString.call(value) == '[object Array]') {\r
          if (showType == 'array-end') {\r
            return this.getShowText({ value: value.at(-1) });\r
          } else {\r
            return value.map((item) => this.getShowText({ value: item })).join('-');\r
          }\r
        } else if (Object.prototype.toString.call(value) == '[object Date]') {\r
          return value.toLocaleDateString();\r
        } else {\r
          return value;\r
        }\r
      },\r
      getItemClassName(column) {\r
        return {\r
          [column.type]: true,\r
          require: column.require,\r
          search: column.type == 'text' && String(column.value).includes(this.config.search),\r
        };\r
      },\r
      getEvents(tdColumn) {\r
        console.log(tdColumn);\r
      },\r
      runEvent(eventName, tdColumn, rowIndex) {\r
        if (tdColumn.events) {\r
          if (typeof tdColumn.events[eventName] == 'function') {\r
            tdColumn.events[eventName](tdColumn, rowIndex, this);\r
          } else if (typeof tdColumn.events[eventName] == 'string') {\r
            functionTotal[tdColumn.events[eventName]] && functionTotal[tdColumn.events[eventName]](tdColumn, rowIndex, this);\r
          }\r
        }\r
      },\r
      editRow(rowData, rowIndex) {\r
        if (this.isEditing) {\r
          this.$message.warning('请先完成当前编辑');\r
          return;\r
        }\r
        this.isEditing = true;\r
        this.$set(\r
          this.tdData,\r
          rowIndex,\r
          rowData.map((item, index) => {\r
            return {\r
              ...item,\r
              ...item.edit,\r
            };\r
          })\r
        );\r
      },\r
      deleteRow(rowData, rowIndex) {\r
        this.tdData.splice(rowIndex, 1);\r
        this.tdInitData.splice(rowIndex, 1);\r
      },\r
      saveRow(rowData, rowIndex) {\r
        this.isEditing = false;\r
        const checkRequire = rowData.some((item) => {\r
          return item.require && !isEmptyValue(item.value);\r
        });\r
        if (checkRequire) {\r
          this.$message.warning('请填写必要字段');\r
          return;\r
        }\r
        if (this.isAdding && rowIndex == this.tdData.length - 1) {\r
          this.isAdding = false;\r
        }\r
        this.tdInitData[rowIndex].forEach((item, index) => {\r
          item.value = rowData[index].value;\r
        });\r
        // 判断是否有保存回调函数，返回为true时继续执行\r
        if (typeof this.config?.onSave == 'function') {\r
          if (!this.config.onSave(rowData, rowIndex, this.tdValues, this)) {\r
            return;\r
          }\r
        }\r
        this.$set(this.tdData, rowIndex, deepClone(this.tdInitData[rowIndex]));\r
      },\r
      cancelRow(rowData, rowIndex) {\r
        this.isEditing = false;\r
        if (this.isAdding) {\r
          this.tdData.pop();\r
          this.tdInitData.pop();\r
          this.isAdding = false;\r
        } else {\r
          this.$set(this.tdData, rowIndex, deepClone(this.tdInitData[rowIndex]));\r
        }\r
      },\r
      addRow() {\r
        if (this.isEditing) {\r
          this.$message.warning('请先完成当前编辑');\r
          return;\r
        }\r
        this.isAdding = true;\r
        this.tdData.push(deepClone(this.addRowData));\r
        this.tdInitData.push(deepClone(this.addRowData));\r
        const index = this.tdData.length - 1;\r
        this.editRow(this.tdData[index], index);\r
      },\r
    },\r
  };\r
<\/script>\r
\r
<style scoped>\r
  .root-table {\r
    position: relative;\r
    width: 100%;\r
    border: 1px solid #3333;\r
  }\r
  .table-content {\r
    width: 100%;\r
    overflow: auto;\r
  }\r
  .table-content-table {\r
    width: 100%;\r
    font-size: 16px;\r
    border: #0a9;\r
  }\r
  .table-content-table th {\r
    height: 50px;\r
    width: 0%;\r
    color: #6cb2ff;\r
    text-align: left;\r
    text-decoration: underline;\r
    background: #eff7ff;\r
    border-right: 1px solid #3333;\r
    border-bottom: 1px solid #3333;\r
    white-space: nowrap;\r
    padding: 0 1em;\r
  }\r
  .table-content-table td {\r
    height: 50px;\r
    padding: 0;\r
    background: white;\r
    border-right: 1px solid #3333;\r
    border-bottom: 1px solid #3333;\r
    white-space: nowrap;\r
  }\r
  .table-content-table td.search {\r
    background: #f9fada;\r
  }\r
  .table-content-table td.require {\r
    background: #fffbe6;\r
  }\r
  .table-content-table .stickyLeft {\r
    position: sticky;\r
    left: 0;\r
    z-index: 99;\r
  }\r
  .table-add {\r
    width: 100%;\r
    height: 50px;\r
    line-height: 50px;\r
    background: white;\r
  }\r
  .table-add p {\r
    margin: 0 auto;\r
    width: fit-content;\r
    cursor: pointer;\r
    color: #6cb2ff;\r
    border-top: 1px solid #3333;\r
  }\r
  /* type == option */\r
  .table-content-table th.option {\r
    text-align: center;\r
  }\r
  .table-content-table td.option > * {\r
    display: flex;\r
    justify-content: center;\r
    color: #6cb2ff;\r
  }\r
  :deep(.table-content-table td.option > * > span) {\r
    margin: 0 5px;\r
    white-space: nowrap;\r
    cursor: pointer;\r
  }\r
  /* type == link */\r
  .table-content-table td.link > * {\r
    color: #6cb2ff;\r
    cursor: pointer;\r
  }\r
  /* type == input */\r
  .table-content-table td.input > * {\r
    width: 100%;\r
    height: 100%;\r
    background: transparent;\r
  }\r
  /deep/ .table-content-table td.input > * .el-input__inner {\r
    width: 100%;\r
    height: 100%;\r
    border: 1px #6cb2ff solid;\r
    box-sizing: border-box;\r
    background: transparent;\r
    border-radius: 0;\r
  }\r
  /* type == select */\r
  /deep/ .table-content-table td.select .el-input__inner {\r
    width: 100%;\r
    height: 50px;\r
    line-height: 50px;\r
    padding: 0;\r
    border-radius: 0px;\r
    border: 1px #6cb2ff solid;\r
    box-sizing: border-box;\r
    background: transparent;\r
  }\r
  /* type == date */\r
  /deep/ .table-content-table td.date .el-input__inner {\r
    /* width: ; */\r
    height: 50px;\r
    padding: 0;\r
    text-indent: 1.5em;\r
    border-radius: 0px;\r
    border: 1px #6cb2ff solid;\r
    box-sizing: border-box;\r
    background: transparent;\r
  }\r
  /deep/ .table-content-table td.date .el-input__prefix {\r
    left: 0;\r
  }\r
  /* type == text */\r
  .table-content-table td.text {\r
    text-indent: 1em;\r
  }\r
</style>\r
\`\`\`\r
\r
\`\`\`html\r
<!-- TableDome.vue -->\r
<template>\r
  <div class="tableDome-root">\r
    <table :data="tableData" :config="tableConfig" :updateTime="updateTime" />\r
  </div>\r
</template>\r
\r
<script>\r
  import Table from '@/components/Table.vue';\r
\r
  export default {\r
    components: { Table },\r
    data: () => ({\r
      updateTime: Date.now(),\r
      tableData: {\r
        ths: [\r
          {\r
            name: '输入框',\r
            edit: { type: 'input', require: true },\r
            events: {\r
              change(...ddd) {\r
                console.log(ddd, '输入框');\r
              },\r
            },\r
          },\r
          {\r
            name: '下拉框',\r
            showType: 'array-all',\r
            edit: {\r
              type: 'select',\r
              typeData: [\r
                {\r
                  value: 22,\r
                  tag: 222,\r
                  children: [\r
                    { value: 22, tag: 222 },\r
                    { value: 33, tag: 333 },\r
                  ],\r
                },\r
                { value: 33, tag: 333 },\r
              ],\r
            },\r
            events: {\r
              change(...ddd) {\r
                console.log(ddd, '下拉框');\r
              },\r
            },\r
          },\r
          { name: '单选框', type: 'checkbox', disabled: true, edit: { disabled: false } },\r
          { name: '日历', edit: { type: 'date' } },\r
          { name: '开关', type: 'switch', disabled: true, edit: { disabled: false } },\r
          { name: '附件' },\r
          { name: '操作', type: 'option', option: '|edit|delete', edit: { option: '|save|cancel' } },\r
        ],\r
        tds: [\r
          ['XX', '321321', true, '2024/6/2', true, '.doc', ''],\r
          ['XX', '321321', true, '2023/6/2', true, '.doc', ''],\r
          ['XX', '321321', true, '2023/6/2', true, '.doc', ''],\r
          ['XX', '321321', true, '2024/6/2', true, '.doc', ''],\r
          ['XX', '321321', false, '2023/6/2', true, '.doc', ''],\r
          ['XX', '321321', true, { value: '2023/6/2', disabled: false }, true, '.doc', ''],\r
          ['XX', '321321', false, '2023/6/2', true, '.doc', ''],\r
        ],\r
      },\r
      tableConfig: {\r
        addible: true,\r
        search: 'ABC',\r
        onSave(rowData, rowIndex, tdValues, vm) {\r
          console.log(rowData, rowIndex, tdValues, vm);\r
          if (rowIndex != 0) {\r
            vm.$message.warning('只可以对第一行数据进行保存');\r
            return false;\r
          }\r
          return true;\r
        },\r
        getItemConfig(itemConfig, tdRow, rowIndex) {\r
          if (new Date(tdRow[3].value) > Date.now()) {\r
            itemConfig.disabled = true;\r
            itemConfig.edit = {\r
              ...itemConfig.edit,\r
              disabled: true,\r
            };\r
          }\r
        },\r
      },\r
    }),\r
  };\r
<\/script>\r
\r
<style>\r
  .tableDome-root {\r
    width: 700px;\r
    margin: 200px auto;\r
  }\r
</style>\r
\`\`\`\r
`;export{n as default};
