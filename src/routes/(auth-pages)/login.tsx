import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth-pages)/login")({
	component: RouteComponent,
});

function RouteComponent() {
    return (
        <section className="authentication">
            <figure className="authentication__logo">
                <img src="/newsify_logo_1.png" alt="Newsify" />
                <figcaption className="authentication__logo-text bold">
                    <span className="authentication__logo-text-main">Newsify</span>
                    <span className="authentication__logo-text-subtext regular">
                        Welcome! Let&apos;s dive into your account!
                    </span>
                </figcaption>
            </figure>

            <form className="authentication__form">
                <button
                    type="button"
                    className="authentication__form-button semibold"
                >
                    <span className="authentication__form-button-text">
                        Continue with Github
                    </span>
                </button>
                <button
                    type="button"
                    className="authentication__form-button semibold"
                >
                    <span className="authentication__form-button-text">
                        Continue with Google
                    </span>
                </button>

                <div className="authentication__form-divider">
                    <hr className="authentication__form-divider-line" />
                    <span className="authentication__form-divider-text regular">
                        or
                    </span>
                    <hr className="authentication__form-divider-line" />
                </div>

                <button
                    type="button"
                    className="authentication__form-button authentication__form-button--primary semibold"
                >
                    <span className="authentication__form-button-text">
                        Sign in with password
                    </span>
                </button>
                <p className="authentication__form-signup-text regular">
                    Don&apos;t have an account?
                    <Link
                        to="/"
                        className="authentication__form-signup-text-link semibold"
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </section>
    )
}
