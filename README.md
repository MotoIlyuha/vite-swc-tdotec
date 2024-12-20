# Конструктор электрической цепи

![Конструктор электрической цепи](public/for%20README/simulation.png "Конструктор электрической цепи")

## Описание проекта

Данный проект представляет собой веб-приложение для симуляции электрических цепей. Приложение позволяет пользователям создавать электрические схемы, подключать компоненты и симулировать работу цепей. Приложение использует библиотеку React для создания интерфейса, а ReactFlow для визуализации и управления рабочей областью.

Проект включает функции создания схем, добавления и настройки компонентов, а также симуляцию электрической цепи с отображением текущих значений силы тока, напряжения и сопротивления. Встроена проверка на ошибки, которая предупреждает пользователя о недочетах в схеме до начала симуляции.

> *Важно! Проект находится на стадии активной разработки. Многие из перечисленных возможностей не реализованы или требуют доработки. Код проекта не является образцом идеального стиля и может содержать баги и временные решения.*

## Технологии

* [React](https://ru.legacy.reactjs.org/): библиотека для создания пользовательских интерфейсов.
* [ReactFlow](https://reactflow.dev/): библиотека для визуализации рабочих областей и управления элементами на них.
* [TypeScript](https://www.typescriptlang.org/): типизированный язык программирования для разработки функционала приложения.
* [Vite](https://vitejs.dev/): инструмент для создания проекта.
* [Bootstrap](https://getbootstrap.com/): библиотека для создания пользовательского интерфейса.

## Функциональные возможности

* Создание [рабочей области](#a-idрабочая_областьрабочая-областьa) с возможностью масштабирования и перемещения.
* Добавление [компонентов](#1-просмотр-и-выбор-компонентов): источник питания, резисторы, лампы, измерительные приборы (амперметры, вольтметры и другие).
* [Интерфейс drag-and-drop](#3-механика-drag-and-drop-возьми-и-положи) для размещения компонентов на рабочей области.
* [Соединение компонентов](#1-процесс-соединения-компонентов) с помощью механизма соединительных точек (Handles).
* [Панель управления](#a-idпанель_управленияпанель-управленияa) для переименования схемы, сохранения и загрузки проектов.
* [Панель компонентов](#a-idпанель_компонентовпанель-компонентовa) с иконками элементов электрической схемы и их всплывающими подсказками.
* [Проверка на ошибки](#a-idпроверка_электрической_цепипроверка-на-ошибки-электрической-цепи-перед-симуляциейa) перед запуском симуляции:
  * Проверка наличия элементов.
  * Проверка наличия источника питания.
  * Проверка замкнутости цепи.
* [Симуляция работы схемы](#симуляция-работы-электрической-схемы) с анимацией тока и отображением значений измерений.
* [Интерактивные элементы](#a-idработа_с_компонентамиработа-с-компонентамиa): изменение ориентации, полярности и характеристик компонентов.
* [Контекстное меню](#a-idконтекстное_менюконтекстное-менюa) для изменения числовых характеристик и удаления элементов.

### <a id="Рабочая_область">Рабочая область</a>

Рабочая область является основным интерфейсом взаимодействия пользователя с приложением и служит для размещения и редактирования элементов электрических цепей. Она должна быть гибкой, масштабируемой и легко адаптируемой к требованиям пользователя.

![Рабочая область](public/for%20README/4.gif "Рабочая область")

#### 1. **Создание сетки с использованием ReactFlow**
- **Компонент Background**: ReactFlow предоставляет компонент `Background`, который позволяет создать сетку на рабочей области. Для этого используется свойство `gap`, которое регулирует расстояние между линиями сетки, например, `{20}`. Это обеспечивает удобную ориентацию и точность размещения элементов.

#### 2. **Реализация приближения и отдаления**
- **Масштабирование**: Для изменения масштаба рабочей области используется свойство `zoom` в ReactFlow. Это позволяет пользователям приближать и отдалять рабочую область для удобства работы с большими схемами, улучшая визуальное восприятие и облегчая манипуляции с элементами.

#### 3. **Реализация перемещения обзора по рабочей области**
- **Перетаскивание (dragging)**:
  - Метод `onDragOver`: используется для обработки события `dragover`, когда элемент перетаскивается над рабочей областью. В этом методе вызывается `event.preventDefault()`, чтобы предотвратить стандартное поведение браузера, и устанавливается `event.dataTransfer.dropEffect = 'move'`, что информирует пользователя о возможности перемещения элемента.
- **Отпускание элемента (drop)**:
  - Метод `onDrop`: обрабатывает событие `drop`, которое происходит, когда элемент отпускается на рабочей области. Здесь также вызывается `event.preventDefault()`, чтобы предотвратить стандартное поведение браузера, и элемент помещается на нужное место в рабочей области.

Эти компоненты и методы вместе создают основу для удобной и интуитивно понятной рабочей области, где пользователи могут размещать и взаимодействовать с элементами электрической цепи.


### <a id="Панель_управления">Панель управления</a>

Панель управления предоставляет пользователю доступ к основным функциям работы с проектом, таким как переименование схемы, сохранение и загрузка проектов.

![Панель управления](public/for%20README/5.gif "Панель управления")

#### 1. **Текстовое поле для ввода названия схемы**
- **Navbar.Text**: Это текстовое поле позволяет пользователю изменить название текущей схемы. По умолчанию оно отображает название «Новая схема», но пользователь может в любой момент ввести новое имя для схемы. Это упрощает процесс работы с проектами, поскольку позволяет быстро обновить название без необходимости искать дополнительные опции.

#### 2. **Кнопка «Сохранить проект» с выпадающим меню**
- **Navbar.Button** с выпадающим меню предоставляет пользователю несколько вариантов для сохранения текущего проекта:
  - **Сохранить как файл**: Пользователь может сохранить проект в выбранном формате, например, в SVG, PNG или JPEG. Это позволяет сохранить проект в виде изображения или векторной схемы.
  - **Сохранить как изображение**: Предлагается выбор формата изображения (SVG, PNG, JPEG), который наиболее подходит для дальнейшего использования или обмена с другими пользователями.

#### 3. **Кнопка «Загрузить проект»**
- **Navbar.Button**: Эта кнопка позволяет пользователю загрузить ранее сохраненный проект из файла. Это важно для восстановления работы после перерыва или для работы с несколькими версиями схем.

Панель управления таким образом обеспечивает удобный и быстрый доступ ко всем необходимым действиям для сохранения, загрузки и изменения названия схемы, улучшая пользовательский опыт при работе с проектами.

### <a id="Панель_компонентов">Панель компонентов</a>

Панель компонентов представляет собой важный инструмент для пользователей, который обеспечивает доступ к основным элементам, необходимым для создания электрических схем. Она располагается с левой стороны рабочей области и является интуитивно понятным интерфейсом для быстрого выбора и добавления компонентов в проект.

![Панель компонентов](public/for%20README/6.gif "Панель компонентов")

#### 1. **Просмотр и выбор компонентов**
- Панель компонентов содержит иконки различных электрических элементов, таких как **источник питания**, **резистор**, **лампа**, **переключатель** и другие компоненты, включая **измерительные приборы** (амперметр, вольтметр, омметр, гальванометр). Все компоненты разделены на две категории: **основные** и **измерительные**, что помогает упростить поиск нужных элементов.

#### 2. **Всплывающие подсказки**
- При наведении курсора на компонент появляется всплывающая подсказка, которая содержит:
  - Название компонента.
  - Краткое описание его назначения.
  - Изображение компонента.
    Это позволяет пользователям быстрее ориентироваться в доступных элементах и понимать их назначение без необходимости открывать дополнительные окна или справочные материалы.

#### 3. **Механика drag and drop (возьми и положи)**
- Панель компонентов поддерживает функцию перетаскивания (drag and drop). Пользователь может выбрать компонент и перетащить его непосредственно на рабочую область. Компонент прикрепляется к курсору, и после отпускания кнопки мыши он фиксируется на рабочей области. Это делает процесс создания схем более удобным и динамичным.

#### 4. **Отображение выбранных компонентов**
- Когда компонент выбран на панели, он визуально выделяется как на самой панели, так и на рабочей области. Это позволяет пользователю видеть, какой элемент был выбран, а также где он находится на рабочей области. Такая визуализация предотвращает ошибки и упрощает процесс редактирования схемы.

#### 5. **Список компонентов на рабочей области**
- Панель компонентов также отображает все элементы, которые уже размещены на рабочей области. Этот список позволяет пользователям контролировать количество и расположение каждого компонента на схеме, что особенно полезно при работе с более сложными проектами. Возможность просматривать все используемые элементы помогает избежать дублирования и облегчает управление большим количеством компонентов.

![Работа_с_компонентами](public/for%20README/components.png "Работа с компонентами")

Панель компонентов таким образом обеспечивает удобный и эффективный способ работы с электрическими схемами, улучшая взаимодействие пользователя с приложением и ускоряя процесс создания проектов.

### <a id="Соединение_компонентов">Соединение компонентов</a>

В приложении для работы с электрическими схемами соединение компонентов реализовано с помощью механизма **ReactFlow**, что обеспечивает удобный и интуитивно понятный процесс соединения элементов на рабочей области.

![Соединение компонентов](public/for%20README/7.gif "Соединение компонентов")

#### 1. **Процесс соединения компонентов**
- **Механизм drag and drop**: Для соединения компонентов используется система соединительных точек (Handles), которые пользователь может "прикрепить" друг к другу. Чтобы начать процесс соединения, пользователь кликает на одну из точек соединения компонента и, удерживая левую кнопку мыши, начинает перетаскивать курсор.
- **Соединительная линия**: В процессе перетаскивания курсора появляется линия, которая визуально следует за движением мыши, демонстрируя потенциальное соединение между точками.

#### 2. **Примагничивание линии**
- Когда соединительная линия приближается к другой точке соединения, линия **примагничивается** к ней, что визуально подтверждает, что соединение возможно. Это позволяет пользователю точно нацелиться на нужную точку и избежать ошибок при установке соединения.
- Примагничивание делает процесс соединения более точным и интуитивно понятным, облегчая работу с крупными и сложными схемами.

#### 3. **Завершение соединения**
- Если пользователь отпускает кнопку мыши в момент, когда линия примагничена к другой точке, соединение устанавливается, и компоненты оказываются связанными.
- Соединительная линия остаётся на рабочей области, показывая, что компоненты теперь соединены.

#### 4. **Отмена соединения**
- Если пользователь отпускает кнопку мыши до того, как линия примагнитится, соединительная линия исчезает, и соединение не устанавливается. Это позволяет избежать случайных ошибок и дает пользователю возможность корректировать действия без ненужных соединений.

#### 5. **Удаление соединений**
- После того, как соединение было установлено, пользователю предоставляется возможность удалить его. Для этого достаточно навести курсор на соединительную линию, и появится кнопка с крестиком, которая позволяет удалить соединение.

![Пример установки соединения](public/for%20README/connect.png "Пример установки соединения и процесса его удаления")

Эта реализация соединений с использованием ReactFlow обеспечивает удобное взаимодействие с компонентами схемы, улучшая точность работы и снижая вероятность ошибок.

### <a id="Работа_с_компонентами">Работа с компонентами</a>

Компоненты в приложении обладают широкими возможностями для настройки и взаимодействия, что значительно упрощает процесс работы с электрическими схемами. Каждый компонент можно адаптировать под конкретные нужды пользователя благодаря функционалу изменения ориентации, полярности, состояния и других характеристик.


![Работа с компонентами](public/for%20README/8.gif "Работа с компонентами")

#### 1. **Изменение ориентации компонента**
- Для изменения ориентации компонента на рабочей области достаточно нажать кнопку рядом с ним, что повернёт элемент на 90 градусов.
- Это позволяет оптимизировать размещение компонентов на схеме, улучшая её читаемость и компактность, что особенно полезно при работе с крупными схемами.

#### 2. **Изменение полярности**
- Компоненты, поддерживающие полярность, такие как источники питания или светодиоды, отображают полярность в виде символов "+" и "-".
- Для изменения полярности пользователь может нажать кнопку, расположенную рядом с компонентом, что меняет направление полярности.
- Эта функция важна для правильного подключения элементов в схемах, где полярность имеет критическое значение (например, для работы с диодами или батареями).

#### 3. **Отображение характеристик компонентов**
- Для удобства пользователей ReactFlow использует компонент **NodeToolbar**, который отображает текущие характеристики компонента. Например, для источника тока будет отображаться его мощность в ваттах (Вт).
- Это позволяет пользователю легко отслеживать параметры элементов без необходимости открывать дополнительные меню или окна, повышая эффективность работы.

#### 4. **Интерактивные элементы**
- Некоторые компоненты, такие как переключатели, могут менять своё состояние при клике. Например, переключатель можно замкнуть или разомкнуть, просто щёлкнув по нему.
- Это делает взаимодействие с компонентами более интуитивным, позволяя пользователям оперативно вносить изменения в схему без дополнительных шагов.

![Пример компонента «Источник питания»](public/for%20README/component_example.png "Пример компонента «Источник питания»")

Эти функции позволяют пользователю с лёгкостью работать с компонентами, модифицировать их в соответствии с потребностями схемы и быстро получать информацию о текущих характеристиках, что значительно упрощает процесс создания и редактирования электрических схем.

### <a id="Контекстное_меню">Контекстное меню</a>

Контекстное меню обеспечивает удобный и быстрый доступ к настройкам компонентов, позволяя пользователям изменять числовые характеристики элементов или выполнять другие действия, такие как удаление.

![Контекстное меню](public/for%20README/9.gif "Контекстное меню")

#### 1. **Изменение числовых характеристик**
- При нажатии правой кнопкой мыши на компонент открывается контекстное меню, где можно настроить числовые параметры элемента.
- Например, для светодиода доступны такие параметры, как **напряжение**, **рабочий ток** и **длина волны**. Для их изменения используются элементы `Form.Control` с типом **"number"**, что гарантирует корректный ввод данных.
- Каждый параметр имеет заранее установленные минимальные и максимальные значения (например, длина волны для светодиода ограничена диапазоном от 400 до 760 нм), предотвращая ошибки ввода.

#### 2. **Изменение в реальном времени**
- Изменения числовых параметров немедленно влияют на внешний вид компонента. Например, изменение длины волны светодиода автоматически меняет его цвет на рабочей области.
- Это позволяет пользователю мгновенно увидеть результаты изменений и принимать решения на основе визуальных данных.

#### 3. **Удаление компонента**
- Контекстное меню также содержит кнопку с изображением **мусорного ведра**, которая позволяет пользователю удалить компонент из схемы.
- Это действие быстро и эффективно удаляет элемент, если он больше не нужен в проекте.

![Контекстное меню](public/for%20README/context_menu.png "Контекстное меню")

Контекстное меню делает работу с компонентами удобной и быстрой, предоставляя все необходимые функции для настройки элементов и управления схемой без необходимости открывать дополнительные панели или окна.

### <a id="Проверка_электрической_цепи">Проверка на ошибки электрической цепи перед симуляцией</a>

Перед запуском симуляции электрической цепи система выполняет комплексную проверку, чтобы гарантировать корректность схемы. При обнаружении ошибок или проблем на рабочей области, система уведомляет пользователя и предоставляет рекомендации для их исправления.

![Проверка_электрической_цепи](public/for%20README/errors.png "Проверка на ошибки электрической цепи перед симуляцией")

#### Процесс проверки и типы ошибок:

1. **Проверка наличия элементов**
  - Если на рабочей области нет ни одного компонента, появится сообщение:  
    *"В рабочей области нет ни одного элемента."*

2. **Проверка наличия источника питания**
  - Если в схеме отсутствует источник питания, появится уведомление:  
    *"В схеме нет ни одного источника питания."*

3. **Проверка принадлежности элементов к электрической цепи**
  - Если в рабочей области есть элементы, которые не принадлежат электрической цепи (например, лишние компоненты), они будут выделены красным цветом, а в описании ошибки появится кнопка *"Удалить"*. Сообщение будет следующим:  
    *"В рабочей области есть элементы, не принадлежащие электрической цепи."*

4. **Проверка замкнутости цепи**
  - Если цепь не замкнута (например, отсутствуют соединения между компонентами), система уведомит пользователя с сообщением:  
    *"Цепь не замкнута."*

#### Индикация и устранение ошибок:

- **Кнопка "Запустить"**: Если в схеме обнаружены ошибки, кнопка "Запустить" окрашивается в красный цвет, а текст на кнопке меняется на *"Ошибка"*, что визуально сигнализирует о наличии проблем.
- **Взаимодействие с рабочей областью**: Статус ошибки изменится, как только пользователь начнёт взаимодействовать с рабочей областью (например, исправит ошибку).

#### Советы по исправлению ошибок:

- **Элементы, не подключенные к цепи**: Если элемент не подключен, в описании ошибки будет предложено удалить его из схемы.
- **Проблемы с полярностью**: Если полярность компонента неправильная (например, у светодиода), элемент будет выделен жёлтым цветом, и пользователь сможет исправить это, кликнув на кнопку изменения полярности.

#### Предупреждения:

- **Полярность**: Если существует вероятность неправильной полярности, будет выведено предупреждение с рекомендацией исправить полярность.
- **Прочие предупреждения**: Система также может выдавать другие предупреждения, которые помогут предотвратить потенциальные проблемы (например, ошибки с подключением).

#### Запуск симуляции:

- Симуляция не начнётся, пока все ошибки не будут устранены. Это гарантирует, что схема будет работать корректно, и пользователь получит надёжные результаты симуляции.


### Симуляция работы электрической схемы

После того как схема прошла проверку на ошибки и все проблемы были устранены, пользователь может запустить симуляцию работы электрической схемы. Процесс симуляции включает несколько ключевых функций, которые не только показывают, как работает схема, но и предоставляют подробную информацию в реальном времени.

![Работа симуляции](public/for%20README/10.gif "Работа симуляции")

#### Ключевые функции симуляции:

1. **Анимация тока**
  - Все соединительные линии, по которым идёт ток, начинают отображать анимацию бегущего пунктира. Эта анимация помогает визуализировать направление и движение тока по схеме, что является важным инструментом для понимания работы электрической цепи.

2. **Отображение измерений**
  - Все измерительные компоненты начинают отображать актуальные значения, которые обновляются в реальном времени:
    - **Амперметр**: показывает силу тока в амперах.
    - **Вольтметр**: показывает напряжение в вольтах.
    - **Омметр**: показывает сопротивление в омах.

3. **Интерактивное отображение данных**
  - При нажатии на любой компонент цепи, на панели симуляции отображаются актуальные значения силы тока, напряжения и сопротивления для этого элемента. Это позволяет пользователю получать подробную информацию о характеристиках каждого компонента схемы.

4. **Изменение параметров в реальном времени**
  - Пользователь может изменять числовые характеристики компонентов через контекстное меню или панель компонентов. Также возможно замыкать или размыкать ключи, не прерывая симуляцию. Все изменения мгновенно отображаются в симуляции, давая пользователю возможность увидеть, как они влияют на работу схемы.

5. **Управление симуляцией**
  - Кнопка "Запустить" меняется на "Пауза" при запуске симуляции. Нажав на кнопку "Пауза", можно временно остановить симуляцию. При этом все анимации прекращаются, а измерительные компоненты перестают показывать актуальные значения. Это позволяет пользователю приостановить процесс для внесения изменений или для более детального анализа состояния схемы.

6. **Автоматическая пауза при изменении схемы**
  - Если пользователь пытается изменить схему во время симуляции (например, удаляет элемент или добавляет новый), симуляция автоматически ставится на паузу. Это предотвращает некорректное отображение данных и работу схемы во время изменений, гарантируя, что все действия будут корректно учтены и отображены.

![Симуляция электрической цепи](public/for%20README/simulation.png "Симуляция электрической цепи")

## Установка

1. Склонируйте репозиторий:
   ```
   git clone https://github.com/MotoIlyuha/vite-swc-tdotec
   ```

2. Перейдите в директорию проекта:
   ```
   cd vite-swc-tdotec
   ```

3. Установите зависимости:
   ```
   npm install
   ```

4. Запустите приложение:
   ```
   npm start
   ```

   Приложение будет доступно по адресу `http://localhost:5173/`.

# Лицензия

Этот проект лицензирован под MIT License — подробности смотрите в файле [LICENSE](https://github.com/MotoIlyuha/vite-swc-tdotec?tab=MIT-1-ov-file).