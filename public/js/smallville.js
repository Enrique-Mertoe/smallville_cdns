/*!
 * Smallvillejs v1.0.0
 * Author: Abuti Martin
 * License: MIT
 * Repository: https://github.com/Enrique-Mertoe/smallville_cdns
 */
!function (w, f) {
    "use strict";
    f(w);
}(window, function (w) {
    "use strict";
    let qry = function (selector) {
        // let list =
        //     typeof selector === "string" ? document.querySelectorAll(selector) :
        //         (selector instanceof NodeList || Array.isArray(selector) ? Array.from(selector) : [selector]);
        // if (selector.SMVQuery && selector !== window) {
        //     list = selector;
        // }

        let list;

        if (typeof selector === "string") {
            selector = selector.trim();
            if (/^<[\w\W]+>$/.test(selector)) {
                let temp = document.createElement("div");
                temp.innerHTML = selector;
                list = Array.from(temp.childNodes);
            } else {
                // Assume it's a CSS selector
                list = document.querySelectorAll(selector);
            }
        } else if (selector instanceof NodeList || Array.isArray(selector)) {
            list = Array.from(selector);
        } else {
            list = [selector];
        }

        if (selector.SMVQuery && selector !== window) {
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
            ready(callback) {
                if (document.readyState === "complete" || document.readyState === "interactive") {
                    setTimeout(callback, 1);
                } else {
                    document.addEventListener("DOMContentLoaded", callback);
                }
            },

            on(event, element_or_callback, callback) {
                // eslint-disable-next-line no-unused-vars
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
                    // eslint-disable-next-line no-unused-vars
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
                // eslint-disable-next-line no-unused-vars
                loop(function (item, _) {
                    item.style.display = "block"
                })
                return this
            },
            hide() {
                // eslint-disable-next-line no-unused-vars
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
            checked(checked) {
                if (typeof checked === "undefined") {
                    if (list.length) {
                        return list[0]?.checked
                    }
                    return null
                }
                loop(function (item) {
                    item.checked = checked;
                })
                return this
            },
            disable(disable) {
                if (typeof disable === "undefined") {
                    if (list.length) {
                        return list[0]?.classList.contains("disabled")
                    }
                    return null
                }
                loop(function (item) {
                    disable ? item.classList.add("disabled") : item.classList.remove("disabled");
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
                    if (value.SMVQuery && value.size && value !== window) {
                        item.innerHTML = "";
                        for (let i = 0; i < value.size; i++) {
                            item.appendChild(value[i]);
                        }
                    } else
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
                // eslint-disable-next-line no-unused-vars
                loop(function (item, _) {
                    for (let property in styles) {
                        if (Object.prototype.hasOwnProperty.call(styles, property)) {

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
            append(content) {
                loop(function (item) {
                    if (typeof content === "string") {
                        item.insertAdjacentHTML("beforeend", content);
                    } else if (content.SMVQuery && content !== window) {
                        if (content.size)
                            content.each(function () {
                                item.appendChild(this);
                            })

                    } else if (content instanceof Node) {
                        item.appendChild(content);
                    } else if (content instanceof NodeList || Array.isArray(content)) {
                        content.forEach(node => {
                            if (node instanceof Node) {
                                item.appendChild(node);
                            }
                        });
                    }
                });
                return this;
            },
            appendTo(container) {
                loop(function (item) {
                    if (typeof container === "string") {
                        $$(container).append(item);
                    } else if (container.SMVQuery && container !== window) {
                        if (container.size)
                            container.append(item)

                    } else if (container instanceof Node) {
                        container.appendChild(item);
                    }
                });
                return this;
            },
            prependTo(container) {
                loop(function (item) {
                    if (typeof container === "string") {
                        $$(container).prepend(item);
                    } else if (container.SMVQuery && container !== window) {
                        if (container.size)
                            container.prepend(item)

                    } else if (container instanceof Node) {
                        container.insertBefore(item, container.firstChild);
                    }
                });
                return this;
            },
            prepend(content) {
                loop(function (item) {
                    if (typeof content === "string") {
                        // If content is a string, interpret it as HTML
                        item.insertAdjacentHTML("afterbegin", content);
                    } else if (content.SMVQuery && content !== window) {
                        if (content.size)
                            content.each(function () {
                                item.insertBefore(this, item.firstChild);
                            })

                    } else if (content instanceof Node) {
                        // If content is a DOM node, prepend it directly
                        item.insertBefore(content, item.firstChild);
                    } else if (content instanceof NodeList || Array.isArray(content)) {
                        // If content is a list of nodes, prepend each one in reverse order
                        Array.from(content).reverse().forEach(node => {
                            if (node instanceof Node) {
                                item.insertBefore(node, item.firstChild);
                            }
                        });
                    }
                });
                return this;
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
            params() {
                if (!list.length) return {width: 0, height: 0};
                let element = list[0];
                if (!element || !(element instanceof Element)) {
                    throw new Error("The argument must be a valid DOM element.");
                }

                const width = element.offsetWidth;
                const height = element.offsetHeight;
                return {width, height};

            },
            offset(position) {
                if (!list.length)
                    return {top: 0, left: 0, right: 0, bottom: 0};

                function getOffset(element) {
                    if (!element || !(element instanceof Element)) {
                        return {top: 0, left: 0, right: 0, bottom: 0};
                    }

                    const rect = element.getBoundingClientRect();
                    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                    const top = rect.top + scrollTop;
                    const left = rect.left + scrollLeft;
                    const right = document.documentElement.clientWidth - rect.right + scrollLeft
                    const bottom = document.documentElement.clientHeight - rect.bottom + scrollTop;
                    return {top, left, right, bottom};
                }

                function getOffsetRelativeToParent(element) {
                    if (!element || !(element instanceof Element)) {
                        return {top: 0, left: 0, right: 0, bottom: 0};
                    }

                    const parent = element.offsetParent;

                    if (!parent) {
                        return {top: 0, left: 0, right: 0, bottom: 0};
                    }

                    const elementRect = element.getBoundingClientRect();
                    const parentRect = parent.getBoundingClientRect();

                    const top = elementRect.top - parentRect.top;
                    const left = elementRect.left - parentRect.left;
                    const right = parentRect.right - elementRect.right;
                    const bottom = parentRect.bottom - elementRect.bottom;

                    return {top, left, right, bottom};
                }

                return position ? getOffsetRelativeToParent(list[0]) : getOffset(list[0]);

            },
            is(comparedTo) {
                if (!list.length)
                    return;
                let match = false;
                let item = list[0];
                if (typeof comparedTo === "string") {
                    if (item.matches(comparedTo)) {
                        match = true;
                    }
                } else if (comparedTo instanceof Element) {
                    if (item === comparedTo) {
                        match = true;
                    }
                } else if (comparedTo.size && comparedTo.SMVQuery && comparedTo !== window) {
                    comparedTo = comparedTo[0];
                    if (item === comparedTo) {
                        match = true;
                    }
                }
                return match;
            },
            each(callback) {
                loop(function (item,index) {
                    callback.call(item, index)
                })
                return this
            },
            modal(action, callback, trigger) {
                callback = typeof callback == "undefined" || typeof callback !== "function" ?
                    function () {
                    } : callback;
                action = typeof action === "undefined" ? "show" : action;
                // eslint-disable-next-line no-unused-vars
                let on_dismiss = [], on_open, on_dismissed = [];
                let props = {
                    onClose(controller) {
                        on_dismiss.push(controller);
                    },
                    onClosed(controller) {
                        on_dismissed.push(controller);
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
                    // eslint-disable-next-line no-unused-vars
                    const dismissed = _ => {
                        if (Array.isArray(on_dismissed))
                            on_dismissed.forEach(d => {
                                d();
                            });
                    };
                    // eslint-disable-next-line no-unused-vars
                    const run_default = _ => {
                        $$(md).rClass("show")
                        // eslint-disable-next-line no-unused-vars
                        SMV.delay(_ => {
                            $$(md).css({
                                display: "none"
                            });
                            dismissed();
                        }, 200);
                    };
                    let ev = {
                        preventDefault() {
                            is_default = false
                        },
                        run_default: run_default
                    }
                    if (Array.isArray(on_dismiss))
                        on_dismiss.forEach(d => {
                            d(ev);
                        })

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
                if (Object.prototype.hasOwnProperty.call(dv, data))
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
                            // eslint-disable-next-line no-unused-vars
                        } catch (_) { /* empty */
                        }
                        dataStore.set(elem, key, data);
                    } else {
                        try {
                            data = this.formatData(dataStore.get(elem, key));
                            // eslint-disable-next-line no-unused-vars
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
    let $$, SMV;
    w.SMVQuery = w.$$ = $$ = qry;

    let smv_ev = {};
    w.SMV = SMV = {
        init: () => {
            function initView() {
                if (!$$(".smv-layout-floating").size) {
                    $$("html").append("<div class=smv-layout-floating>");
                    $$(".smv-layout-floating").append(`
                            <div class="page-loader">
                                <div class="page-loader-content">
                                    <span class="loader-spinner"></span>
                                </div>
                            </div>`);
                } else {
                    // alert()
                    // eslint-disable-next-line no-unused-vars
                    setTimeout(_ => initView(), 300);
                }
            }

            $$(document).ready(function () {
                initView();
            })
            SMV.events()
        },
        loader: {
            // eslint-disable-next-line no-unused-vars
            show: _ => {
                let ld = $$(".page-loader").css({display: "block"});
                // eslint-disable-next-line no-unused-vars
                setTimeout(_ => ld.aClass("show"))
            },
            // eslint-disable-next-line no-unused-vars
            hide: _ => {
                let ld = $$(".page-loader").rClass("show");
                // eslint-disable-next-line no-unused-vars
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
            // eslint-disable-next-line no-unused-vars
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
                            SMV.watcher(newContent);
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
                    const url = $$(this).attr('data-smv-link') || $$(this).attr('href');
                    SMV.smv_page(url);
                }).on("click", "[data-smv-toggle=modal]", function (ev) {
                ev.preventDefault();
                let target = $$(this).data("smv-target") || $$(this).attr("href");
                $$(target).modal("show", null, this);
            });
            $$(w).on("popstate", function (ev) {
                ev.preventDefault();
                SMV.smv_page(w.location.pathname);
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
                // eslint-disable-next-line no-unused-vars
                let end = !!0

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
    };
    //smv-ajax
    $$.post = function () {
        let url, data, ok, error;
        if (arguments.length) {
            if (typeof arguments[0] === "object" && arguments[0].url) {
                url = arguments[0].url;
                data = arguments[0].data ?? {};
                ok = arguments[0].ok;
                error = arguments[0].error;
            } else {
                url = "string" === typeof arguments[0] ? arguments[0] : "";
                data = "function" !== typeof arguments[1] ? arguments[1] : {};
                [ok, error] = Array.from(arguments).slice(-2).filter(arg => typeof arg === "function");
            }
        }
        if (!url) {
            throw new Error("URL is required for fetch API")
        }
        return $$.post.dispatch({
            url: url,
            body: data,
            method: "POST",
            ok: ok,
            error: error
        });
    };
    $$.post.dispatch = function (
        {
            url,
            body,
            method,
            ok, error,
            ...options
        }) {
        const controller = new AbortController();
        const signal = controller.signal;

        function do_abort() {
            controller.abort();
        }

        const SMVAjax = function (callback) {
            return new SMVAjax.init(callback);
        };
        let ok_info, error_info, res_c, err_c;
        (SMVAjax.init = function (callback) {
            callback(res => {
                ok_info = res
                typeof ok_info !== "undefined" && res_c ? res_c(ok_info) : null;
            }, err => {
                error_info = err
                typeof error_info !== "undefined" && err_c ? err_c(error_info) : null;
            });
        }).prototype = {
            catch(e) {
                err_c = e;
                return this;
            },
            then(e) {
                res_c = e;
                return this;
            },
            abort() {
                do_abort();
                return this;
            }
        }

        const toUrlEncoded = (data, parentKey = "") => {
            const params = [];

            for (const key in data) {
                const fullKey = parentKey ? `${parentKey}[${key}]` : key;
                let value = data[key];
                if (value === undefined) {
                    value = '';
                }
                if (value && typeof value === "object" && !Array.isArray(value)) {
                    params.push(...toUrlEncoded(value, fullKey));
                } else if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        params.push(...toUrlEncoded(item, `${fullKey}[${index}]`)); // Recurse for arrays
                    });
                } else {
                    params.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`);
                }
            }

            return params;
        };
        return SMVAjax((resolve, reject) => {
            const run_catch = err => {
                typeof error === "function" ? error(err) : null;
                reject(err);
            };
            const run_resolved = res => {
                if (typeof ok === "function") ok(res);
                resolve(res);
            };

            let headers = {};
            if (body instanceof FormData) {
                //pass
            } else if (typeof body === "string") {
                headers["Content-Type"] = "application/x-www-form-urlencoded";
            } else if (typeof body === "object") {
                headers["Content-Type"] = "application/x-www-form-urlencoded";
                const urlEncodedString = toUrlEncoded(body).join("&");
                body = new URLSearchParams(urlEncodedString);
            }
            fetch(url, {
                method,
                headers,
                body,
                signal,
                ...options
            }).then(res => {
                if (!res.ok)
                    res.status !== 404 ? run_catch(res) : null
                else {
                    const contentType = res.headers.get("Content-Type");
                    if (contentType && contentType.includes("application/json")) {
                        return res.json();
                    } else {
                        return res.text();
                    }
                }
            }).then(data => typeof data !== "undefined" ? run_resolved(data) : null)
                .catch(run_catch);
        })
    };
    SMV.init();

    //modals
    const Modal = function (content) {
        return new Modal.init(content);
    };
    (Modal.init = function (content) {
        this.view = content;
        let self = this;
        let on_hide_callbacks = [],
            on_show_callbacks = [];
        const run_hide = function () {
            content.rClass("show").css({opacity: 0, transition: '.2s'});
            // eslint-disable-next-line no-unused-vars
            setTimeout(_ => content.css({display: "none"}), 200);

        }
        const hide = function () {
            let def = !!1;
            on_hide_callbacks.some(e => {
                typeof e === "function" ? e.call(self, {
                    preventDefault() {
                        def = !!0;
                    },
                    dismiss: run_hide,
                    clear() {
                        setTimeout(() => {
                            content.remove();
                        }, 300)
                    }
                }) : null;
            });

            if (def) run_hide();
        }
        const show = function () {
            on_show_callbacks.some(e => {
                typeof e === "function" ? e.call(self) : null;
            })
            content.css({display: 'block', opacity: 1});
            setTimeout(() => content.aClass("show"))
        }
        const on_hide = function (callback) {

            on_hide_callbacks.push(callback);
        }
        const on_show = function (callback) {
            on_show_callbacks.push(callback);
        }
        content.data("show", show);
        content.data("hide", hide);
        content.data("on_hide", on_hide);
        content.data("on_show", on_show);
        content.find("[data-smv-dismiss=modal]").on("click", function (ev) {
            ev.preventDefault();
            hide();
        });
        w.SMVSignalBox.on("modal-content",function (){
            content.find("[data-smv-dismiss=modal]").on("click", function (ev) {
                ev.preventDefault();
                hide();
            });
        });

    }).prototype = Modal.prototype = {
        constructor: Modal,
        onDismiss() {
            this.view.data("on_hide")(...arguments);
            return this;
        },
        onOpen() {
            this.view.data("on_show")(...arguments);
            return this;
        },
        show() {
            this.view.data("show")();
            return this;
        },
        dismiss() {
            this.view.data("hide")();
            return this;
        }
    };
    w.Modal = Modal;

    //signalbox
    w.SMVSignalBox = (function () {
        let eventHandlers = {};
        let plugins = {};

        return {
            /**
             * Attach an event listener.
             * @param {string} action - Event name
             * @param {Function} handler - Callback function
             */
            on(action, handler) {
                eventHandlers[action] = eventHandlers[action] || [];
                eventHandlers[action].push(handler);
            },

            /**
             * Attach a one-time event listener.
             * @param {string} action - Event name
             * @param {Function} handler - Callback function
             */
            once(action, handler) {
                const wrapper = (...args) => {
                    handler(...args);
                    this.off(action, wrapper);
                };
                this.on(action, wrapper);
            },

            /**
             * Remove a specific event handler or all handlers for an event.
             * @param {string} action - Event name
             * @param {Function} [handler] - Specific handler to remove (optional)
             */
            off(action, handler) {
                if (!eventHandlers[action]) return;

                if (!handler) {
                    delete eventHandlers[action];
                } else {
                    eventHandlers[action] = eventHandlers[action].filter(h => h !== handler);
                }
            },

            /**
             * Trigger an event with optional arguments.
             * @param {string} action - Event name
             * @param {...any} args - Arguments to pass to handlers
             */
            trigger(action, ...args) {
                eventHandlers[action]?.forEach(handler => handler(...args));
            },

            /**
             * Get a list of all registered event names.
             * @returns {string[]} - Array of event names
             */
            events() {
                return Object.keys(eventHandlers);
            },

            /**
             * Check if an event has any registered handlers.
             * @param {string} action - Event name
             * @returns {boolean} - True if event has handlers
             */
            has(action) {
                return !!eventHandlers[action]?.length;
            },

            /**
             * Remove all event listeners.
             */
            clearAll() {
                eventHandlers = {};
            },

            /**
             * Register a plugin for extending Listener.
             * @param {string} name - Plugin name
             * @param {Function} plugin - Plugin function
             */
            registerPlugin(name, plugin) {
                if (plugins[name]) {
                    throw new Error(`Plugin "${name}" is already registered.`);
                }
                plugins[name] = plugin;
            },

            /**
             * Use a registered plugin.
             * @param {string} name - Plugin name
             * @param {...any} args - Arguments to pass to the plugin
             */
            use(name, ...args) {
                if (!plugins[name]) {
                    throw new Error(`Plugin "${name}" is not registered.`);
                }
                return plugins[name](this, ...args);
            },

            /**
             * Get a list of registered plugins.
             * @returns {string[]} - Array of plugin names
             */
            plugins() {
                return Object.keys(plugins);
            }
        };
    })();
});
// smv js v1.0.1