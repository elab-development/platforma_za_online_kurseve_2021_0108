public function up()
{
    Schema::table('certificates', function (Blueprint $table) {
        $table->renameColumn('certificate_url', 'certificate');
    });
}

public function down()
{
    Schema::table('certificates', function (Blueprint $table) {
        $table->renameColumn('certificate', 'certificate_url');
    });
}
