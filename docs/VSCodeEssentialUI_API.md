---
id: 1749709816380 # 文章id
date: 2025-06-18 15:42
title: VSCode 插件开发：交互控件 API 介绍 # 文章标题
description: VSCode 插件开发：交互控件 API 介绍 # 文章描述
tag: Vscode插件开发 # 文章标签
archive: Vscode插件开发 # 文章归档
recommendations: # 相关推荐id
hidden: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# VSCode 插件开发：交互控件 API 介绍

在 VSCode 插件开发中，交互控件 API 是实现用户交互的核心工具。可以通过这些 API 轻松地获取用户输入、展示信息、选择文件或目录。

## 输入框 vscode.window.showInputBox

输入框是获取用户输入文本信息的一种常见方式。通过 `vscode.window.showInputBox` 方法，可以弹出一个输入框，让用户输入内容。该方法接受一个配置对象作为参数，该对象包含以下可选属性：

- **`password`**：布尔值，表示输入的内容是否为密码。如果是密码，输入的内容会以点或星号显示。
- **`ignoreFocusOut`**：布尔值，表示当输入框失去焦点时是否忽略关闭。如果设置为 `true`，即使用户点击输入框外的区域，输入框也不会消失。
- **`placeHolder`**：字符串，表示输入框内的提示信息。
- **`prompt`**：字符串，表示输入框下方的提示信息。
- **`validateInput`**：函数，用于对用户输入的内容进行验证，并返回验证结果。

```javascript
vscode.window
  .showInputBox({
    password: false,
    ignoreFocusOut: true,
    placeHolder: '请输入内容',
    prompt: '请输入文本信息',
    validateInput: function (text) {
      return text;
    },
  })
  .then(function (msg) {
    if (msg) {
      console.log('用户输入：', msg);
      vscode.window.showInformationMessage('你输入的内容是：' + msg);
    }
  });
```

## 二、选择框 vscode.window.showQuickPick

选择框可以为用户提供一组选项，用户可以从这些选项中选择一个或多个。通过 `vscode.window.showQuickPick` 方法可以实现这一功能。该方法的第一个参数是一个数组，数组中的每个元素可以是一个字符串，也可以是一个对象。如果是一个对象，可以包含以下属性：

- **`label`**：字符串，表示选项的显示文本。
- **`description`**：字符串，表示选项的描述信息。
- **`detail`**：字符串，表示选项的详细信息。

第二个参数是一个配置对象，包含以下可选属性：

- **`canPickMany`**：布尔值，表示是否可以选择多个选项。
- **`ignoreFocusOut`**：布尔值，表示当选择框失去焦点时是否忽略关闭。
- **`placeHolder`**：字符串，表示选择框内的提示信息。

```javascript
vscode.window
  .showQuickPick(
    [
      { label: '选项1', description: '这是第一个选项', detail: '详细信息1' },
      { label: '选项2', description: '这是第二个选项', detail: '详细信息2' },
      { label: '选项3', description: '这是第三个选项', detail: '详细信息3' },
    ],
    {
      canPickMany: false,
      ignoreFocusOut: true,
      placeHolder: '请选择一个选项',
    }
  )
  .then(function (selection) {
    if (selection) {
      vscode.window.showInformationMessage('你选择了：' + selection.label);
    }
  });
```

## 信息提示 vscode.window.show...Message

信息提示用于向用户展示一些重要的信息或提示。VSCode 提供了多种信息提示方法，包括：

- **`vscode.window.showInformationMessage`**：显示普通信息提示。
- **`vscode.window.showWarningMessage`**：显示警告信息提示。
- **`vscode.window.showErrorMessage`**：显示错误信息提示。

这些方法的第一个参数是要显示的信息内容，第二个参数是一个可选的按钮数组，用户可以点击这些按钮来执行相应的操作。

```javascript
vscode.window.showInformationMessage('这是一条普通信息！');
vscode.window.showWarningMessage('这是一条警告信息！');
vscode.window.showErrorMessage('这是一条错误信息！');

vscode.window.showInformationMessage('是否要继续操作？', '是', '否').then((result) => {
  if (result === '是') {
    vscode.window.showInformationMessage('你选择了继续操作！');
  } else {
    vscode.window.showInformationMessage('你选择了取消操作！');
  }
});
```

### 文件选择对话框 vscode.window.showOpenDialog

`vscode.window.showOpenDialog` 方法用于打开文件选择对话框，方法接受一个配置对象作为参数，该对象包含以下可选属性：

- **`canSelectFiles`**：布尔值，表示是否可以选择文件。
- **`canSelectFolders`**：布尔值，表示是否可以选择文件夹。
- **`canSelectMany`**：布尔值，表示是否可以选择多个文件或文件夹。
- **`defaultUri`**：`Uri` 对象，表示默认打开的路径。
- **`openLabel`**：字符串，表示打开按钮的文本。
- **`filters`**：数组，用于指定可选择的文件类型。

```javascript
vscode.window
  .showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    defaultUri: vscode.Uri.file('/D:/'),
    openLabel: '选择文件',
    filters: [
      { name: '文本文件', extensions: ['txt'] },
      { name: '图片文件', extensions: ['jpg', 'png'] },
    ],
  })
  .then((fileUri) => {
    if (fileUri && fileUri.length > 0) {
      vscode.window.showInformationMessage('你选择的文件路径是：' + fileUri[0].fsPath);
    }
  });
```

### 文件保存对话框 vscode.window.showSaveDialog

`vscode.window.showSaveDialog` 方法用于弹出文件保存对话框，它接受一个配置对象作为参数，该对象包含以下可选属性：

- **`defaultUri`**：`Uri` 对象，表示默认保存的路径。
- **`saveLabel`**：字符串，表示保存按钮的文本。
- **`filters`**：数组，用于指定可保存的文件类型。

```javascript
vscode.window
  .showSaveDialog({
    defaultUri: vscode.Uri.file('/D:/'),
    saveLabel: '保存文件',
    filters: [
      { name: '文本文件', extensions: ['txt'] },
      { name: 'JSON文件', extensions: ['json'] },
    ],
  })
  .then((fileUri) => {
    vscode.window.showInformationMessage('你选择的保存路径是：' + fileUri.fsPath);
  });
```
