const LoadingSpinner = () => {
    return (
        <section className="py-3 py-md-5 min-vh-50 d-flex justify-content-center align-items-center">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                            <h3 className="h2 mb-2">{"Oops! Long Loading."}</h3>
                            <p className="mb-5">Data may have been deleted, contact the SelarasHomeId admin.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LoadingSpinner