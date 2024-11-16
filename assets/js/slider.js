document.addEventListener("DOMContentLoaded", function () {
    var section = document.getElementById('statistics-section');

    var observerCallback = function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                var statistic1 = new CountUp('statistic1', 0, 26);
                var statistic2 = new CountUp('statistic2', 0, 12);
                var statistic3 = new CountUp('statistic3', 0, 14);
                var statistic4 = new CountUp('statistic4', 0, 8);

                if (!statistic1.error) statistic1.start();
                if (!statistic2.error) statistic2.start();
                if (!statistic3.error) statistic3.start();
                if (!statistic4.error) statistic4.start();

                observer.unobserve(section);
            }
        });
    };

    var observer = new IntersectionObserver(observerCallback, {
        root: null,
        threshold: 0.1
    });

    observer.observe(section);
});
