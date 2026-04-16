$(function () {
    const cats = [
        {
            id: 1,
            name: "Luna",
            personality: "Calm observer who loves soft jazz and window naps.",
            trait: "calm",
            image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80",
            hoverImage: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=900&q=80",
            featuredImage: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1400&q=80"
        },
        {
            id: 2,
            name: "Milo",
            personality: "Playful sprinter that chases strings and greets everyone.",
            trait: "playful",
            image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=80",
            hoverImage: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=80",
            featuredImage: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1400&q=80"
        },
        {
            id: 3,
            name: "Nori",
            personality: "Curious explorer with dramatic tail flicks and brave jumps.",
            trait: "curious",
            image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=900&q=80",
            hoverImage: "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?auto=format&fit=crop&w=900&q=80",
            featuredImage: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1400&q=80"
        },
        {
            id: 4,
            name: "Sasha",
            personality: "Confident diva that poses for photos and loves attention.",
            trait: "confident",
            image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=900&q=80",
            hoverImage: "https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?auto=format&fit=crop&w=900&q=80",
            featuredImage: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1400&q=80"
        },
        {
            id: 5,
            name: "Toby",
            personality: "Friendly food critic with a loud purr and goofy charm.",
            trait: "friendly",
            image: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?auto=format&fit=crop&w=900&q=80",
            hoverImage: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=900&q=80",
            featuredImage: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?auto=format&fit=crop&w=1400&q=80"
        }
    ];

    const $grid = $("#catGrid");
    const $menuList = $("#catMenuList");
    const $feedback = $("#searchFeedback");
    const $menuPanel = $("#catMenuPanel");

    function createCardMarkup(cat, index) {
        return `
            <div class="col-12 col-sm-6 col-lg-4">
                <article class="cat-card" style="animation-delay:${index * 90}ms">
                    <div class="cat-photo-wrap">
                        <img
                            src="${cat.image}"
                            alt="${cat.name}"
                            class="cat-photo"
                            data-default="${cat.image}"
                            data-hover="${cat.hoverImage}"
                            data-id="${cat.id}"
                        >
                    </div>
                    <div class="cat-card-body">
                        <h3 class="cat-name h4">${cat.name}</h3>
                        <p class="cat-personality">${cat.personality}</p>
                    </div>
                </article>
            </div>
        `;
    }

    function createMenuMarkup(cat) {
        return `
            <button class="cat-menu-item" data-id="${cat.id}" type="button">
                ${cat.name}
                <small>${cat.trait}</small>
            </button>
        `;
    }

    function renderCards(list) {
        if (!list.length) {
            $grid.html(`
                <div class="col-12">
                    <div class="alert alert-warning mb-0">No cats match your search. Try another mood or name.</div>
                </div>
            `);
            return;
        }

        const html = list.map((cat, index) => createCardMarkup(cat, index)).join("");
        $grid.html(html);
    }

    function renderMenu(list) {
        const html = list.map((cat) => createMenuMarkup(cat)).join("");
        $menuList.html(html);
    }

    function setFeaturedCat(cat) {
        if (!cat) {
            return;
        }

        const $img = $("#featuredCatImage");
        $img.stop(true, true).fadeOut(140, function () {
            $img.attr("src", cat.featuredImage);
            $img.attr("alt", cat.name);
            $img.fadeIn(220);

            // Highlight selection with a short expand animation.
            $img.addClass("is-expanded");
            setTimeout(function () {
                $img.removeClass("is-expanded");
            }, 430);
        });

        $("#featuredCatName").text(cat.name);
        $("#featuredCatPersonality").text(cat.personality);
    }

    function findCats(query) {
        const normalized = query.trim().toLowerCase();
        if (!normalized) {
            return cats;
        }

        return cats.filter(function (cat) {
            return (
                cat.name.toLowerCase().includes(normalized) ||
                cat.personality.toLowerCase().includes(normalized) ||
                cat.trait.toLowerCase().includes(normalized)
            );
        });
    }

    function runSearch() {
        const query = $("#catQuery").val();
        const found = findCats(query);

        renderCards(found);

        if (query.trim() === "") {
            $feedback.text("Showing all 5 cats.");
            setFeaturedCat(cats[0]);
            return;
        }

        if (found.length > 0) {
            $feedback.text(`Found ${found.length} matching cat(s).`);
            setFeaturedCat(found[0]);
        } else {
            $feedback.text("No matches found.");
        }
    }

    $("#menuToggle").on("click", function () {
        $menuPanel.stop(true, true).slideToggle(260);
        const isExpanded = $(this).attr("aria-expanded") === "true";
        $(this).attr("aria-expanded", String(!isExpanded));
        $(this).text(isExpanded ? "Expand Cat Menu" : "Collapse Cat Menu");
    });

    $menuList.on("click", ".cat-menu-item", function () {
        const catId = Number($(this).data("id"));
        const selected = cats.find((cat) => cat.id === catId);
        setFeaturedCat(selected);

        $(".cat-menu-item").removeClass("active");
        $(this).addClass("active");
    });

    $("#findCatBtn").on("click", runSearch);

    $("#resetCatsBtn").on("click", function () {
        $("#catQuery").val("");
        renderCards(cats);
        setFeaturedCat(cats[0]);
        $feedback.text("Reset complete. Showing all cats.");
    });

    $("#catQuery").on("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            runSearch();
        }
    });

    $grid.on("mouseenter", ".cat-photo", function () {
        const $img = $(this);
        $img.stop(true, true).fadeOut(120, function () {
            $img.attr("src", $img.data("hover"));
            $img.fadeIn(180);
        });
    });

    $grid.on("mouseleave", ".cat-photo", function () {
        const $img = $(this);
        $img.stop(true, true).fadeOut(120, function () {
            $img.attr("src", $img.data("default"));
            $img.fadeIn(180);
        });
    });

    renderMenu(cats);
    renderCards(cats);
    setFeaturedCat(cats[0]);
    $(".cat-menu-item").first().addClass("active");
    $feedback.text("Showing all 5 cats.");
});
