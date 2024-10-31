const MOCK_NOTES = [
    {
        id: 1,
        title: "Объекты (JavaScript)",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscin",
        isLike: false,
        color: "yellow",
    },
    {
        id: 2,
        title: "Flexbox (CSS)",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscingelit, sed do eiusmod tempor",
        isLike: true,
        color: "blue",
    },
];

// хранение данных, бизнес-логика
const model = {
    notes: [],
    colors: [
        {
            id: 1,
            color: "yellow",
            isSelected: true,
        },
        {
            id: 2,
            color: "green",
            isSelected: false,
        },
        {
            id: 3,
            color: "blue",
            isSelected: false,
        },
        {
            id: 4,
            color: "red",
            isSelected: false,
        },
        {
            id: 5,
            color: "lilac",
            isSelected: false,
        },
    ],

    addNote(title, description, color) {
        //добавляем задачу
        const newNote = {
            title: title,
            isLike: false,
            description: description,
            id: Math.random(),
            color,
        };
        if (title.trim() !== "" && description.trim() !== "") {
            if (title.length > 50) {
                view.renderMessage(
                    false,
                    "Максимальная длина заголовка - 50 символов"
                );
            } else {
                this.notes.push(newNote);
                view.renderNotes(this.notes); //обновляем представление

                view.renderCount(this.notes);
                view.renderMessage(true, "Заметка добавлена!");
            }
        } else {
            view.renderMessage(false, "Заполните все поля!");
        }
    },
    deleteNote(noteId) {
        //удаляем задачу
        this.notes = this.notes.filter((note) => note.id !== noteId);

        view.renderNotes(this.notes);
        view.renderCount(this.notes);
        view.renderMessage(true, "Заметка удалена!");
    },
    toggleColor(colorId) {
        this.colors = this.colors.map((color) => {
            if (color.id === +colorId) {
                console.log(colorId);
                color.isSelected = !color.isSelected;
            } else {
                color.isSelected = false;
            }
            return color;
        });
        view.renderColors(this.colors);
    },
    toggleNote(noteId) {
        this.notes = this.notes.map((note) => {
            if (note.id == noteId) {
                note.isLike = !note.isLike;
            }
            return note;
        });

        view.renderNotes(model.notes); // Обновляем представление
    },

    toggleLike(isChecked) {
        let newNotes = [];
        if (isChecked) {
            newNotes = this.notes.filter((note) => note.isLike);
        } else {
            newNotes = this.notes;
        }
        view.renderNotes(newNotes);
        view.renderCount(newNotes);
    },
};

// отображение данных: рендер списка задач, размещение обработчиков событий
const view = {
    init() {
        this.renderNotes(model.notes);
        this.renderColors(model.colors);
        const form = document.querySelector(".form");
        const input = document.querySelector(".nameNotes");
        const textarea = document.querySelector(".aboutNotes");

        // Добавляем обработчик события на форму
        form.addEventListener("submit", function (event) {
            event.preventDefault(); //предотвращаем стандартное поведение формы
            const color = document.querySelector(".selected");

            controller.addNote(input.value, textarea.value, color.classList[1]); //вызываем метод addNote контролера
            input.value = ""; //очищает поле ввода
            textarea.value = ""; //очищает поле ввода
        });

        const notesList = document.querySelector(".notes");
        notesList.addEventListener("click", function (event) {
            if (event.target.classList.contains("like")) {
                const noteId =
                    +event.target.parentElement.parentElement.parentElement.id;

                controller.toggleNote(noteId);
            }
            if (event.target.classList.contains("delete-button")) {
                const noteId =
                    +event.target.parentElement.parentElement.parentElement.id;
                //вызываем метод контроллера для удаления задачи

                controller.deleteNote(noteId);
            }
        });

        const colors = document.querySelector(".conteinerColor");
        colors.addEventListener("click", function (event) {
            if (event.target.classList.contains("circle")) {
                controller.toggleColor(event.target.id);
            }
        });
        const checkbox = document.querySelector(".check");
        checkbox.addEventListener("change", function () {
            const isChecked = this.checked;
            controller.toggleLike(isChecked);
        });

        this.renderCount(model.notes);
    },

    renderNotes(notes) {
        const notesList = document.querySelector(".notes"); //обращаемся к ul по классу, чтобы в последуешщем добавлять задачи
        let notesHTML = ""; //создаем пустую строку, будем пушить задачу
        for (let i = 0; i < notes.length; i++) {
            const note = notes[i];

            notesHTML =
                notesHTML +
                `
            <li id="${note.id}"  class="newNotes">
                    <div class="headerNewNotes ${note.color}">
                        <h2>${note.title}</h2>
                        <div class="iconNotes">
                            <img
                                class="like"
                                src="${
                                    note.isLike
                                        ? "images/heart active.svg"
                                        : "images/heart inactive.svg"
                                }"
                                alt="like"
                                width="16"
                                height="16"
                            />
                            <img
                                class="delete-button"
                                src="images/trash.svg"
                                alt=""
                                width="16"
                                height="16"
                            />
                        </div>
                    </div>
                    <div class="newNotesP">
                        <p>${note.description}</p>
                    </div>
                </li>
        `;
        }
        if (notes.length === 0) {
            notesHTML = `
                <div class="container message">
                    У вас нет еще ни одной заметки <br />
                    Заполните поля выше и создайте свою первую заметку!
            </div>
                `;
        }

        notesList.innerHTML = notesHTML; //добавление нашей li в list
    },

    renderColors(colors) {
        const colorsList = document.querySelector(".conteinerColor");
        let colorsHTML = "";

        for (let i = 0; i < colors.length; i++) {
            const color = colors[i];

            colorsHTML =
                colorsHTML +
                `
            <li id="${color.id}" class="circle ${color.color} ${
                    color.isSelected ? "selected" : ""
                }"></li>
        `;
        }

        colorsList.innerHTML = colorsHTML;
    },

    renderCount(notes) {
        const count = document.querySelector(".notesCount");
        count.textContent = notes.length;
    },

    renderMessage(isSuccess, message) {
        let toastTimeout;

        const toast = document.querySelector(
            isSuccess ? ".toastSuccess" : ".toastWarning"
        );

        let toastMessage = toast.querySelector(".toastMessage");

        if (message) {
            toastMessage.textContent = message;
        }

        toast.classList.add("active");
        toastTimeout = setTimeout(() => {
            toast.classList.remove("active");
        }, 3500);

        toast.addEventListener("click", () => {
            toast.classList.remove("active");
            clearTimeout(toastTimeout);
        });
    },
};

// обработка действий пользователя, обновление модели
const controller = {
    addNote(title, description, color) {
        //добавляем задачу
        model.addNote(title, description, color);
    }, //добавляем задачу
    deleteNote(id) {
        model.deleteNote(id);
    },
    toggleColor(id) {
        model.toggleColor(id);
    },
    toggleNote(id) {
        model.toggleNote(id);
    },
    toggleLike(isChecked) {
        model.toggleLike(isChecked);
    },
};

function viewDefault() {
    view.init();
}
viewDefault();
