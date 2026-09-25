export function HeroSection() {
  return (
    <section className="bg-surface pt-20">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24 lg:px-10">
        {/* Content */}
        <div className="flex flex-col items-start text-right">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-2 text-xs font-medium text-on-surface">
            <span className="material-symbols-outlined text-[16px] text-primary">
              verified
            </span>
            کیفیت، تنوع و قیمت مناسب
          </span>

          <h1 className="max-w-xl text-4xl font-semibold leading-[1.25] tracking-tight text-on-surface md:text-5xl lg:text-6xl">
            فرش مناسب
            <br />
            <span className="text-primary">خانه‌ات را پیدا کن</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-on-surface-variant md:text-lg">
            مجموعه‌ای از فرش‌های زیبا و باکیفیت با امکان تهیه مستقیم از
            کارخانه و مشاوره برای انتخاب بهترین گزینه برای خانه شما.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary transition-colors hover:bg-on-surface"
            >
              مشاهده فرش‌ها
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
            </a>

            <a
              href="#consultation"
              className="inline-flex items-center gap-2 rounded-xl bg-surface-container-low px-6 py-3.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[18px]">
                support_agent
              </span>
              مشاوره رایگان
            </a>
          </div>

          {/* Trust points */}
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-outline-variant/30 pt-6">
            <div>
              <p className="text-sm font-semibold text-on-surface">
                قیمت مناسب
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                نزدیک به قیمت کارخانه
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-on-surface">
                تنوع بالا
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                طرح و سایزهای مختلف
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-on-surface">
                مشاوره
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                قبل از خرید
              </p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface-container-low">
            <img
              src="/images/home/hero-carpet.jpg"
              alt="فرش مریم"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Floating card */}
          <div className="absolute bottom-6 left-6 rounded-2xl bg-surface-container-lowest/95 p-4 shadow-lg backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-primary">
                <span className="material-symbols-outlined">
                  local_shipping
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-on-surface">
                  ارسال به سراسر ایران
                </p>
                <p className="mt-0.5 text-xs text-on-surface-variant">
                  بسته‌بندی ایمن و مطمئن
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}