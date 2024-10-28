!function (w, f) {
    f(w);
}(window, function (w) {
    let ed = {};
    let qry = function (selector) {
        let list =
            typeof selector === "string" ? document.querySelectorAll(selector) :
                (selector instanceof NodeList || Array.isArray(selector) ? Array.from(selector) : [selector]);
        if (selector.SMVQuery) {
            list = selector;
        }
        let loop = action => {
            list.forEach((it, index) => {
                action.call(0, it, index);
            })
        }

        let cb = {
            SMVQuery: qry,
            size: list.length,
            on(event, element_or_callback, callback) {
                loop(function (item, _) {
                    item.addEventListener(event, function (ev) {
                        if (callback) {
                            if (ev.target.closest(element_or_callback)) {
                                callback.call(ev.target.closest(element_or_callback), ev)
                            }
                        } else
                            element_or_callback.call(item, ev)
                    })
                })
                return this
            },
            click(controller) {
                if (typeof controller === "undefined") {
                    loop(function (item, _) {
                        item.click();
                    })
                    return this
                }
                return this.on("click", controller);

            },
            scroll: (callback) => {
                cb.on("scroll", callback);
                return this
            },
            show() {
                loop(function (item, _) {
                    item.style.display = "block"
                })
                return this
            },
            hide() {
                loop(function (item, _) {
                    item.style.display = "none"
                })
                return this
            },
            attr(attr_name, value) {
                if (typeof value === "undefined") {
                    if (list.length) {
                        return list[0]?.getAttribute(attr_name)
                    }
                    return null
                }
                loop(function (item) {
                    item.setAttribute(attr_name, value)
                })
                return this
            },

            hAttr(attr_name) {
                if (typeof attr_name !== "string")
                    return false
                return list[0]?.hasAttribute(attr_name)
            },

            txt(value) {
                if (typeof value === "undefined") {
                    if (list.length) {
                        return list[0]?.textContent
                    }
                    return null
                }
                loop(function (item) {
                    item.textContent = value;
                })
                return this
            },
            val(value) {
                if (typeof value === "undefined") {
                    if (list.length) {
                        return list[0]?.value
                    }
                    return null
                }
                loop(function (item) {
                    item.value = value;
                })
                return this
            },
            html(value) {
                if (typeof value === "undefined") {
                    if (list.length) {
                        return list[0]?.innerHTML
                    }
                    return null
                }
                loop(function (item) {

                    item.innerHTML = value;

                })
                smv_ev["html"]?.forEach(cb => {
                    cb?.call(null, {});
                });
                return this
            },
            remove() {
                loop(function (item) {
                    if (item.parentNode) {
                        item.parentNode.removeChild(item);
                    }
                });
                return this;
            },
            empty() {
                loop(function (item) {
                    while (item.firstChild) {
                        item.removeChild(item.firstChild);
                    }
                });
                return this;
            },
            css(styles) {
                loop(function (item, _) {
                    for (let property in styles) {
                        if (styles.hasOwnProperty(property)) {

                            const camelCaseProperty = property.replace(/-([a-z])/g, g => g[1].toUpperCase());
                            item.style[camelCaseProperty] = styles[property];
                        }
                    }
                });
                return this;
            },
            rmvAttr(attr_name) {
                loop(function (item) {
                    if (item.hasAttribute(attr_name))
                        item.removeAttribute(attr_name)
                })
                return this
            },
            next() {
                let nextElements = [];
                loop(function (item) {
                    let next = item.nextElementSibling;
                    if (next) {
                        nextElements.push(next);
                    }
                });
                return qry(nextElements);
            },
            prev() {
                let nextElements = [];
                loop(function (item) {
                    let next = item.previousElementSibling;
                    if (next) {
                        nextElements.push(next);
                    }
                });
                return qry(nextElements);
            },
            find(selector) {
                let foundElements = [];
                loop(function (el) {
                    let next = el.querySelectorAll(selector);
                    if (next.length) {
                        foundElements = foundElements.concat(Array.from(next));
                    }
                });
                return qry(foundElements);
            },
            closest(selector) {
                let closestElements = [];
                loop(function (item) {
                    let closestElement = item.closest(selector);
                    if (closestElement) {
                        closestElements.push(closestElement);
                    }
                });
                return qry(closestElements);
            },
            aClass(classNames) {
                if (typeof classNames !== "string")
                    return this

                classNames.split(/\s+/).forEach(class_name => {
                    loop(function (el) {
                        el.classList.add(class_name)
                    })
                })
                return this
            },
            tClass(classNames) {
                if (typeof classNames !== "string")
                    return this

                classNames.split(/\s+/).forEach(class_name => {
                    loop(function (el) {
                        el.classList.toggle(class_name)
                    })
                })
                return this
            },
            hClass(className) {
                if (typeof className !== "string")
                    return false
                return list[0]?.classList.contains(className)
            },
            id() {
                if (!list.length)
                    return undefined
                return list[0]?.id
            },
            rClass(classNames) {
                if (typeof classNames !== "string")
                    return this

                classNames.split(/\s+/).forEach(class_name => {
                    loop(function (el) {
                        el.classList.remove(class_name)
                    })
                })
                return this
            },
            is(comparedTo) {
                let match = false;
                loop(function (item) {
                    if (typeof comparedTo === "string") {
                        if (item.matches(comparedTo)) {
                            match = true;
                        }
                    } else if (comparedTo instanceof Element) {
                        if (item === comparedTo) {
                            match = true;
                        }
                    } else if (comparedTo.size && comparedTo.SMVQuery) {
                        comparedTo.each(comparedItem => {
                            if (item === comparedItem) {
                                match = true;
                            }
                        });
                    }
                });
                return match;
            },
            each(callback) {
                loop(function (item) {
                    callback.call(item, item)
                })
                return this
            },
            modal(action, callback, trigger) {
                callback = typeof callback == "undefined" || typeof callback !== "function" ?
                    function () {
                    } : callback;
                action = typeof action === "undefined" ? "show" : action;
                let on_dismiss, on_open;
                let props = {
                    onClose(controller) {
                        on_dismiss = controller;
                    },
                    onOpen(controller) {
                        on_open = controller;
                    }
                }

                const callback_trigger = properties => {
                    props = {...props, ...properties}
                    callback(props);
                    return props;
                }

                const show = (md) => {
                    $$(md).css({
                        display: "block"
                    });
                    SMV.delay(_ => $$(md).aClass("show"));
                    let show_props = {
                        identity: $$(md),
                        trigger: typeof trigger === "undefined" ? undefined : $$(trigger),
                        root: $$(md),
                        body: $$(md).find(".modal-body")
                    }
                    let p = callback_trigger(show_props)
                    smv_ev["modal-open"]?.forEach(cb => {
                        cb?.call(null, p);
                    });
                }
                const hide = md => {
                    let is_default = !!1;
                    const run_default = _ => {
                        $$(md).rClass("show")
                        SMV.delay(_ => $$(md).css({
                            display: "none"
                        }), 200);
                    }
                    let ev = {
                        preventDefault() {
                            is_default = false
                        },
                        run_default: run_default
                    }
                    if (typeof on_dismiss === "function")
                        on_dismiss(ev)

                    if (is_default)
                        run_default()


                }
                loop(function (item, _) {
                    action === "show" ? show(item) : hide(item);
                    $$(item).find("[data-smv-dismiss=modal]")
                        .on("click", function (ev) {
                            ev.preventDefault();
                            hide(item)
                        })
                });
                return this
            }
        }
        Object.assign(cb, list);

        let jsonReg = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
        let data_actions = {
            formatData(data) {
                let dv = {
                    "true": true,
                    "false": false,
                    "null": null
                }
                if (dv.hasOwnProperty(data))
                    return dv
                if (data === +data + "") {
                    return +data;
                }
                if (jsonReg.test(data)) {
                    return JSON.parse(data);
                }
                return data;
            },
            dataAttr(elem, key, data) {
                let name;
                if (data === undefined && elem.nodeType === 1) {
                    name = "data-" + key.replace(/[A-Z]/g, "-$&").toLowerCase();
                    data = elem.getAttribute(name);

                    if (typeof data === "string") {
                        try {
                            data = this.formatData(data);
                        } catch (e) {
                        }
                        dataStore.set(elem, key, data);
                    } else {
                        try {
                            data = this.formatData(dataStore.get(elem, key));
                        } catch (e) {
                            data = dataStore.get(elem, key)
                        }
                    }
                }
                return data;
            }
        }

        let extension = {
            data(key, value) {
                if (typeof key === "undefined") {
                    return;
                }
                if (typeof value === "undefined") {
                    if (list.length) {
                        let item = list[0];
                        return data_actions.dataAttr(item, key, value);
                    }
                    return null
                }
                loop(function (item) {
                    dataStore.set(item, key, value)
                })
                return this;
            },
        }
        return {...cb, ...extension}
    }


    /**
     * smv_data manager
     * @constructor
     */
    let SMVData;
    (SMVData = function () {
        this.storeId = "SMVQuery" + ("random" + Math.random()).replace(/\D/g, "") + SMVData.key_ref++;
    }).prototype = {
        stored: function (element) {
            let value = element[this.storeId]
            if (!value) {
                value = {}
                element[this.storeId] = value
            }
            return value;
        },
        set: function (element, data_key, value) {
            let cache = this.stored(element);

            if (typeof data_key === "string") {
                cache[data_key] = value;
            } else {
                for (let prop in data_key) {
                    cache[prop] = data_key[prop];
                }
            }
            return cache;
        },
        get: function (element, key) {
            return key === undefined ?
                this.stored(element) :
                element[this.storeId] && element[this.storeId][key];
        },
    };

    SMVData.key_ref = 1;
    let dataStore = new SMVData();
    qry.post = function () {

    }
    w.SMVQuery = w.$$ = qry;

    let smv_ev = {};
    w.SMV = {
        init: () => {
            function initView() {
                if (!$$(".smv-layout-floating").size) {
                    $("html").append("<div class=smv-layout-floating>");
                    $(".smv-layout-floating").append(`
                            <div class="page-loader">
                                <div class="page-loader-content">
                                    <span class="loader-spinner"></span>
                                </div>
                            </div>`);
                } else {
                    alert()
                    setTimeout(_ => initView(), 300);
                }
            }

            $(document).ready(function () {
                initView();
            })
            SMV.events()
        },
        loader: {
            show: _ => {
                let ld = $(".page-loader").css({display: "block"});
                setTimeout(_ => ld.addClass("show"))
            },
            hide: _ => {
                let ld = $(".page-loader").removeClass("show");
                setTimeout(_ => ld.css({display: "none"}), 300)
            }
        },
        is_form_empty(f) {
            let ep = 0;

            function o(v) {
                return typeof v !== "undefined" && String(v).trim().length > 0;
            }

            $$(f).find("input,[contenteditable],textarea").each(function (e) {
                if (['radio', 'checkbox'].includes(this.type)) return;
                if (!(o(this.value) || o(this.textContent))) {
                    ep += 1;
                }
            });
            return ep > 0;
        },
        smv_url(url) {
            return location.origin + "/" + url;
        },
        xhr(u, d) {
            return $.post({
                url: this.smv_url('xhr/' + u),
                data: d
            })
        },
        btn_loader: (btn) => {
            btn = $$(btn);
            return {
                load() {
                    btn.aClass("submitting")
                    return this;
                },
                dismiss() {
                    btn.rClass("submitting")
                    return this;
                }
            };
        },
        smv_page: url => {
            url && url !== "#" && (_ => {
                SMV.loader.show();
                $.ajax({
                    url: url,
                    type: 'GET',
                    success: function (response) {
                        let isDefault = true;
                        smv_ev["page-change"]?.forEach(cb => {
                            cb?.call(null, {
                                title: document.title,
                                preventDefault() {
                                    isDefault = false
                                },
                                run_default: run_default
                            });
                        });

                        function run_default() {
                            SMV.loader.hide();

                            response = $(document.createElement('div')).html(response);

                            history.pushState(null, null, url);
                            document.title = $(response).find('title').text().trim();

                            let newContent = $(response).find('.smv-layout').html();
                            newContent = $(newContent)
                            $('.smv-layout').empty().html(newContent);
                            w.scrollTo({
                                top: 0,
                                behavior: 'smooth',
                            })
                            // smv.watcher(newContent);
                        }

                        if (isDefault) {
                            run_default();
                        }

                    },
                    error: function () {
                        alert('An error occurred. Please try again.');
                        SMV.loader.hide();
                    }
                });
            })()
        },
        events() {
            $$(document)
                .on('click', '[data-smv-link]', function (e) {
                    e.preventDefault();
                    const url = $$(this).attr('data-smv-link');
                    SMV.smv_page(url);
                }).on("click", "[data-smv-toggle=modal]", function (ev) {
                ev.preventDefault();
                let target = $$(this).data("smv-target") || $$(this).attr("href");
                $$(target).modal("show", null, this);
            });
        },
        on(event, callback) {
            typeof event === "string" && typeof callback === "function"
            && (() => {
                let ev = smv_ev[event] || [];
                ev.push(callback);
                smv_ev[event] = ev;
            })()
            return this;

        },
        watcher: content => {
            content = $(content);
            const revealElements = content.find('.smv-reveal');

            const revealOnScroll = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(_ => entry.target.classList.add('active'), 100)
                        observer.unobserve(entry.target); // Stop observing once the class is added
                    } else {
                        entry.target.classList.remove('active')
                    }
                });
            };

            const observer = new IntersectionObserver(revealOnScroll, {
                root: null, // Observe relative to the viewport
                rootMargin: '0px', // No margin
                threshold: 0.1 // Trigger when 10% of the element is in view
            });

            revealElements.each(function () {
                observer.observe(this);
            });
            $$(".typing-wrapper").each(function (argument) {
                // body...
                const typingSpeed = 50;
                const erasingSpeed = 50;
                const delay = 3000;
                let start = !!1,
                    end = !!0

                let maxl = $(this).find(".typing-text").each(function () {
                    this.style.display = 'none';
                }).length;

                let currentIndex = 0;
                let typingTexts = $(".typing-text");

                function typeText(index) {

                    let textElement = typingTexts.eq(index);
                    const text = textElement.text().trim();
                    let charIndex = 0;
                    let isTyping = true;
                    textElement.show();

                    function type() {

                        if (isTyping) {
                            textElement.text(text.substring(0, charIndex + 1));
                            charIndex++;
                            if (charIndex === text.length) {
                                isTyping = false;
                                end = !!1
                                setTimeout(type, delay);
                                $$(".ityped-cursor").aClass("blinking")
                            } else {
                                setTimeout(type, typingSpeed);
                                $$(".ityped-cursor").rClass("blinking")
                            }
                        } else {
                            textElement.text(text.substring(0, charIndex - 1));
                            charIndex--;
                            if (charIndex === 0) {
                                $$(".ityped-cursor").aClass("blinking")
                                textElement.hide().text(text);
                                currentIndex = (currentIndex + 1) % typingTexts.length;
                                if (currentIndex > maxl) {
                                    currentIndex = 0;
                                }
                                setTimeout(() => typeText(currentIndex), 100);
                            } else {
                                $$(".ityped-cursor").rClass("blinking")
                                setTimeout(type, erasingSpeed);
                            }

                        }


                    }


                    type();
                }


                typeText(currentIndex);
            });
        },
        delay(controller, time) {
            setTimeout(controller, time || 0)
            return this;
        }
    }
    SMV.init();
})
