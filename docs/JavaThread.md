---
id: 1769737144995 # 文章id
date: 2026/1/30 09:39 # 时间
title: Java 线程总结 # 文章标题
description: Java 线程总结 # 文章描述
tag: Java # 文章标签
archive: # 文章归档
# recommendations: { recommendations } # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# Java 线程总结

Java 线程是实现并发编程的基础，允许程序同时执行多个独立的任务，充分利用 CPU 多核资源，提升程序运行效率。

## 什么是线程和进程

**操作**系统进行资源分配和调度的基本单位，是程序的一次执行实例。  
**线程**是操作系统能够进行运算调度的最小单位，它被包含在进程之中，是进程中的实际运作单位。

| 维度         | 进程                 | 线程                     |
| ------------ | -------------------- | ------------------------ |
| **资源占用** | 独立内存空间         | 共享进程内存             |
| **创建开销** | 较大                 | 较小                     |
| **通信方式** | 进程间通信（IPC）    | 直接读写共享内存         |
| **崩溃影响** | 独立，不影响其他进程 | 可能影响同进程的其他线程 |

#### 线程优势：

1. **提升程序性能**：充分利用多核CPU的计算能力；
1. **提高响应速度**：避免因单个耗时操作导致界面卡顿；
1. **实现异步处理**：让耗时操作在后台运行，不阻塞主流程；

### 线程生命周期

```java
// Java线程的6种状态（Thread.State枚举）
public enum State {
    NEW,           // 新建状态，尚未调用start()
    RUNNABLE,      // 可运行状态（包含就绪和运行）
    BLOCKED,       // 阻塞状态，等待获取监视器锁
    WAITING,       // 无限期等待，需其他线程唤醒
    TIMED_WAITING, // 超时等待，等待指定时间
    TERMINATED     // 终止状态，线程执行完毕
}
```

状态之间的转换是线程操作的核心逻辑：`新建(NEW)`→`就绪/运行(RUNNABLE)`→`阻塞(BLOCKED) / 等待(WAITING) / 超时等待(TIMED_WAITING)`→`终止(TERMINATED)`，任何线程都无法跳过中间状态直接完成生命周期转换。

## 创建线程

### Thread类（不推荐）

继承`Thread`类并重写`run`方法，`run`方法为线程的执行体，通过`start`方法启动线程。

```java
/**
 * 示例：通过继承Thread创建线程
 * 缺点：Java单继承限制，耦合度高
 */
public class MusicDownloadThread extends Thread {
    private String songName;

    public MusicDownloadThread(String songName) {
        this.songName = songName;
    }

    @Override
    public void run() {
        System.out.println("开始下载歌曲: " + songName);
        try {
            // 模拟下载耗时
            Thread.sleep(3000);
            System.out.println("歌曲下载完成: " + songName);
        } catch (InterruptedException e) {
            System.out.println("下载被中断: " + songName);
        }
    }

    public static void main(String[] args) {
        // 创建并启动下载线程
        MusicDownloadThread downloader = new MusicDownloadThread("Imagine.mp3");
        downloader.start();  // 注意：调用start()而不是run()

        System.out.println("主线程继续执行，不会被阻塞...");
    }
}
```

> > 直接调用`run`只是普通方法执行，不会创建新线程。

### Runnable 接口（推荐）

实现`Runnable`接口并实现`run`方法，将`Runnable`实例传入`Thread`构造器创建线程，解决了单继承的限制，实现了任务与线程的解耦（任务逻辑在 Runnable 中，线程由 Thread 管理），是开发中最常用的方式。

```java
/**
 * 示例：通过Runnable创建线程
 * 优点：实现解耦，支持资源共享
 */
public class MusicPlayer implements Runnable {
    private String playlistName;
    private volatile boolean isPlaying = true;

    public MusicPlayer(String playlistName) {
        this.playlistName = playlistName;
    }

    @Override
    public void run() {
        System.out.println("开始播放歌单: " + playlistName);
        int track = 1;

        while (isPlaying && track <= 10) {
            System.out.println("正在播放第" + track + "首歌...");
            try {
                Thread.sleep(1000);  // 模拟播放时间
                track++;
            } catch (InterruptedException e) {
                System.out.println("播放被中断");
                break;
            }
        }
        System.out.println("播放结束");
    }

    public void stopPlaying() {
        isPlaying = false;
    }

    public static void main(String[] args) throws InterruptedException {
        // 创建任务
        MusicPlayer player = new MusicPlayer("我的最爱");

        // 创建线程并启动
        Thread playerThread = new Thread(player, "音乐播放线程");
        playerThread.start();

        // 主线程等待5秒后停止播放
        Thread.sleep(5000);
        player.stopPlaying();
        playerThread.join();  // 等待播放线程结束

        System.out.println("程序结束");
    }
}
```

> Thread.join() 方法让当前线程等待调用 join() 方法的线程执行完毕。  
> playerThread.join(); 无限等待  
> playerThread.join(3000); 最多等待3秒

也可以使用`Lambda`创建线程如下（功能有所阉割）：

```java
public class MusicPlayer {
    public static void main(String[] args) throws InterruptedException {
        new Thread(() -> {
            System.out.println("开始播放歌单: " + "我的最爱");
            int track = 1;

            while (track <= 10) {
                System.out.println("正在播放第" + track + "首歌...");
                try {
                    Thread.sleep(1000);  // 模拟播放时间
                    track++;
                } catch (InterruptedException e) {
                    System.out.println("播放被中断");
                    break;
                }
            }
            System.out.println("播放结束");
        }, "test").start();

        System.out.println("主程序结束");
    }
}
```

### Callable 接口（返回值）

实现`Callable`接口并实现`call`方法，结合`FutureTask`使用，解决了`Thread`和`Runnable`无返回值、无法抛出受检异常的问题，适用于需要获取线程执行结果的场景。`FutureTask`可接收`Callable`实例，同时实现了`Runnable`和`Future`接口，既能作为任务传入`Thread`，又能通过`get`方法获取返回值。

```java
import java.util.concurrent.*;

/**
 * 示例：通过Callable创建带返回值的线程
 * 适用场景：需要获取线程执行结果
 */
public class MusicSearchService implements Callable<List<String>> {
    private String keyword;
    private int maxResults;

    public MusicSearchService(String keyword, int maxResults) {
        this.keyword = keyword;
        this.maxResults = maxResults;
    }

    @Override
    public List<String> call() throws Exception {
        System.out.println("开始搜索歌曲，关键词: " + keyword);
        List<String> results = new ArrayList<>();

        // 模拟网络搜索耗时
        for (int i = 1; i <= maxResults; i++) {
            Thread.sleep(500);  // 模拟延迟
            results.add(keyword + " - 歌曲" + i);
            System.out.println("找到第" + i + "个结果");
        }

        return results;
    }

    public static void main(String[] args) throws Exception {
        // 创建搜索任务
        Callable<List<String>> searchTask = new MusicSearchService("周杰伦", 5);

        // 包装为FutureTask
        FutureTask<List<String>> futureTask = new FutureTask<>(searchTask);

        // 创建并启动线程
        Thread searchThread = new Thread(futureTask, "搜索线程");
        searchThread.start();

        System.out.println("主线程继续执行其他操作...");

        // 获取搜索结果（会阻塞直到任务完成）
        List<String> searchResults = futureTask.get();
        System.out.println("搜索结果: " + searchResults);
    }
}
```

> > get 为阻塞方法，会等待线程执行完成。

## 线程安全

这里模拟没有任何控制的多线程窗口出票的场景：

```java
public class UnsafeTicketSystem {
    private int tickets = 5;

    public void sellTicket() throws InterruptedException{
        if (tickets <= 0) return;
        Thread.sleep(10);  // 模拟出票时间
        tickets--;
        System.out.println(Thread.currentThread().getName() + "售出一张票，剩余: " + tickets);
    }

    public static void main(String[] args) throws InterruptedException {
        UnsafeTicketSystem system = new UnsafeTicketSystem();

        // 创建售票窗口（线程）
        for (int i = 1; i <= 2; i++) {
            new Thread(() -> {
                while (system.tickets > 0) system.sellTicket();
            }, "窗口" + i).start();
        }
    }
}
```

可能出现以下输出：

```txt
窗口1售出一张票，剩余: 3
窗口2售出一张票，剩余: 3
窗口1售出一张票，剩余: 1
窗口2售出一张票，剩余: 1
窗口1售出一张票，剩余: 0
窗口2售出一张票，剩余: -1
```

这是因为线程每次取数据和写数据的顺序是不定的。当第一个线程取数据还没有写入新数据时第二个线程取到的数据就是原始数据，导致结果不对。

### synchronized 关键字

`synchronized` 是 `Java` 内置的同步锁机制，用于保证多线程环境下对共享资源的安全访问。它确保同一时刻只有一个线程可以执行特定的代码段或方法，但是会完全阻塞其他同一创建的线程。

这里给`sellTicket`方法加上`synchronized`：

```java
public class UnsafeTicketSystem {
    private int tickets = 5;

    public synchronized void sellTicket() throws InterruptedException{
        if (tickets <= 0) return;
        Thread.sleep(10);  // 模拟出票时间
        tickets--;
        System.out.println(Thread.currentThread().getName() + "售出一张票，剩余: " + tickets);
    }

    public static void main(String[] args) throws InterruptedException {
        UnsafeTicketSystem system = new UnsafeTicketSystem();

        // 创建售票窗口（线程）
        for (int i = 1; i <= 2; i++) {
            new Thread(() -> {
                while (system.tickets > 0) system.sellTicket();
            }, "窗口" + i).start();
        }
    }
}
```

这可能出现以下输出：

```txt
窗口1售出一张票，剩余: 4
窗口1售出一张票，剩余: 3
窗口1售出一张票，剩余: 2
窗口1售出一张票，剩余: 1
窗口1售出一张票，剩余: 0
```

> 因为窗口1线程在运行时会阻塞窗口2的进程并把全部票买完才会结束线程，当窗口2线程运行时已经没有票了。

### Lock 显式锁

`Java`中的`Lock`是显式锁（也叫手动锁），属于`java.util.concurrent.locks`包下的核心接口，是对传统`synchronized`隐式锁的补充和增强，通过手动获取和手动释放锁实现并发控制，解决了`synchronized`灵活性不足、无法中断等待、不能尝试非阻塞获取锁等问题。

```java
public class UnsafeTicketSystem {
    private int tickets = 5;
    private final Lock lock = new ReentrantLock();

    public void sellTicket() {
        if (tickets <= 0) return;
        lock.lock(); // 获取锁
        try {
            Thread.sleep(10);
            tickets--;
            System.out.println(Thread.currentThread().getName() + "售出一张票，剩余: " + tickets);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            lock.unlock(); // 释放锁（finally保证必执行）
        }
    }

    public static void main(String[] args) throws RuntimeException {
        UnsafeTicketSystem system = new UnsafeTicketSystem();

        for (int i = 1; i <= 2; i++) {
            new Thread(() -> {
                while (system.tickets > 0) system.sellTicket();
            }, "窗口" + i).start();
        }
    }
}
```

## 参考

<!-- Java 线程池 -->

<!-- Java 线程间通信与协作 -->
