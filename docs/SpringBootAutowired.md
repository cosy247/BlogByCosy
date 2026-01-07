---
id: 1767768517038 # 文章id
date: 2026/1/7 14:48 # 时间
title: SpringBoot 中 @Autowired 注解用法详解 # 文章标题
description: SpringBoot 中 @Autowired 注解用法详解 # 文章描述
tag: 后端 SpringBoot # 文章标签
archive: # 文章归档
# recommendations: { recommendations } # 相关推荐id
shadow: false # 是否隐藏
top: 0 # 是否zhi置顶，数字越大优先级越高
---

# SpringBoot 中 @Autowired 注解用法详解

## 引言

在 SpringBoot 应用中，依赖注入（Dependency Injection）允许对象从外部接收其依赖项，而不是自己创建它们。而 `@Autowired` 注解则是实现依赖注入的关键工具，它用于自动装配 Spring 容器中的 bean，可以应用于构造器、方法、参数和字段上。

## 注入方式

### 字段注入（Field Injection）

这是最简单直接的注入方式，直接在字段上使用注解：

```java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
```

> 代码简洁，易于阅读；  
> 不需要 setter 方法或构造器

> > 不利于单元测试（需要使用反射）；  
> > 隐藏了依赖关系；  
> > 不符合不可变对象原则；

### 构造器注入（Constructor Injection）

Spring 官方推荐的方式，通过构造器进行注入：

```java
@Service
public class OrderService {

    private final PaymentService paymentService;
    private final NotificationService notificationService;

    @Autowired
    public OrderService(PaymentService paymentService, NotificationService notificationService) {
        this.paymentService = paymentService;
        this.notificationService = notificationService;
    }

    // 从Spring 4.3开始，单一构造器可以省略@Autowired
    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
        this.notificationService = null;
    }
}
```

> 明确依赖关系，一目了然；  
> 便于单元测试；  
> 支持不可变对象（final 字段）；

### 2.3 Setter 方法注入（Setter Injection）

通过 setter 方法进行注入：

```java
@Service
public class ProductService {

    private InventoryService inventoryService;
    private PricingService pricingService;

    @Autowired // 需要注解才会装入
    public void setInventoryService(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    public void setPricingService(PricingService pricingService) {
        this.pricingService = pricingService;
    }
}
```

> 允许在 bean 创建后重新配置；  
> 可选依赖时比较有用；

### 方法注入

可以注入到任意方法中（和 setter 差不多）：

```java
@Component
public class DataInitializer {

    private DataSource dataSource;

    @Autowired
    public void prepareDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
        // 初始化数据源配置
    }
}
```

## @Autowired 的高级特性

### 可选依赖（required=false）

当依赖不是必须时，可以使用 `required=false`：

```java
@Service
public class ReportService {

    @Autowired(required = false)
    private EmailService emailService;

    public void generateReport() {
        // 业务逻辑
        if (emailService != null) {
            emailService.sendReport();
        }
    }
}
```

### @Primary 明确注入

当有多个相同类型的 bean 时，Spring 需要明确知道注入哪一个：

```java
@Configuration
public class AppConfig {

    @Bean
    @Primary  // 优先使用这个bean
    public PaymentService creditCardPaymentService() {
        return new CreditCardPaymentService();
    }

    @Bean
    public PaymentService paypalPaymentService() {
        return new PayPalPaymentService();
    }
}

@Service
public class CheckoutService {

    @Autowired  // 会自动注入CreditCardPaymentService
    private PaymentService paymentService;
}
```

#### @Qualifier 明确指定 bean 名称

```java
@Configuration
public class AppConfig {

    @Bean("creditCardPayment")
    public PaymentService creditCardPaymentService() {
        return new CreditCardPaymentService();
    }

    @Bean("paypalPayment")
    public PaymentService paypalPaymentService() {
        return new PayPalPaymentService();
    }
}

@Service
public class CheckoutService {

    @Autowired
    @Qualifier("paypalPayment")  // 明确指定bean名称
    private PaymentService paymentService;
}
```

### 集合类型注入

Spring 支持注入集合类型：

```java
@Service
public class NotificationDispatcher {

    // 注入所有NotificationSender实现
    @Autowired
    private List<NotificationSender> senders;

    // 注入Map，key为bean名称
    @Autowired
    private Map<String, NotificationSender> senderMap;

    public void sendNotifications(String message) {
        senders.forEach(sender -> sender.send(message));
    }
}
```

## 参考

1. [Using @Autowired :: Spring Framework](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired.html)
